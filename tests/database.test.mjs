import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { PGlite } from '@electric-sql/pglite'
const db = new PGlite()
const user = '11111111-1111-4111-8111-111111111111',
    other = '22222222-2222-4222-8222-222222222222',
    admin = '33333333-3333-4333-8333-333333333333'
const course = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    module = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    free = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    paid = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd'
async function as(role, id, sql) {
    await db.exec(`set role ${role};set request.jwt.claim.sub='${id || ''}';`)
    try {
        return await db.query(sql)
    } finally {
        await db.exec('reset role')
    }
}
await db.exec(
    `create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema public,auth to anon,authenticated,service_role;`,
)
await db.exec(readFileSync('supabase_schema_dropdown.sql', 'utf8'))
const migration = readFileSync('sql/20260910_complete_academy.sql', 'utf8')
await db.exec(migration)
await db.exec(migration)
await db.exec(
    `insert into auth.users values('${user}','student@example.test','{"full_name":"Studente Test"}'),('${other}','other@example.test','{}'),('${admin}','admin@example.test','{}');update dropdown_profiles set is_admin=true where id='${admin}';insert into dropdown_courses(id,slug,title,description,price,category,is_published) values('${course}','test-course','Corso test','Descrizione',15,'altro',true);insert into dropdown_course_modules(id,course_id,title,order_index) values('${module}','${course}','Modulo',0);insert into dropdown_lessons(id,module_id,title,order_index,is_free,video_id) values('${free}','${module}','Anteprima',0,true,'https://youtu.be/abcdefghijk'),('${paid}','${module}','Lezione privata',1,false,'https://vimeo.com/123456');`,
)
test('profiles are private; admins can read students without recursion', async () => {
    assert.equal((await as('anon', null, 'select * from dropdown_profiles')).rows.length, 0)
    assert.equal((await as('authenticated', user, 'select * from dropdown_profiles')).rows.length, 1)
    assert.equal((await as('authenticated', admin, 'select * from dropdown_profiles')).rows.length, 3)
})
test('student cannot promote themselves or forge a purchase', async () => {
    await assert.rejects(
        as('authenticated', user, `update dropdown_profiles set is_admin=true where id='${user}'`),
        /permission denied/,
    )
    await assert.rejects(
        as(
            'authenticated',
            user,
            `insert into dropdown_purchases(user_id,course_id,amount_paid,status) values('${user}','${course}',15,'completed')`,
        ),
        /permission denied/,
    )
    await as(
        'authenticated',
        user,
        `update dropdown_profiles set full_name='Studente Test' where id='${user}'`,
    )
})
test('syllabus readable but paid video columns are denied, free preview allowed', async () => {
    assert.equal((await as('anon', null, 'select id,title from dropdown_lessons')).rows.length, 2)
    await assert.rejects(as('anon', null, 'select video_id from dropdown_lessons'), /permission denied/)
    assert.equal((await as('anon', null, `select * from dropdown_lesson_media('${course}')`)).rows.length, 1)
    assert.equal(
        (await as('authenticated', admin, `select * from dropdown_lesson_media('${course}')`)).rows.length,
        2,
    )
})
test('non-owner cannot save progress or receive certificate', async () => {
    await assert.rejects(
        as(
            'authenticated',
            other,
            `insert into dropdown_user_progress(user_id,lesson_id,completed) values('${other}','${paid}',true)`,
        ),
        /row-level security/,
    )
    assert.equal(
        (await as('authenticated', other, "select * from dropdown_certificate('test-course')")).rows.length,
        0,
    )
})
test('verified purchase grants videos; all lessons required for certificate', async () => {
    await db.exec(
        `insert into dropdown_purchases(user_id,course_id,amount_paid,status,paypal_order_id) values('${user}','${course}',15,'completed','ORDER123')`,
    )
    assert.equal(
        (await as('authenticated', user, `select * from dropdown_lesson_media('${course}')`)).rows.length,
        2,
    )
    assert.equal(
        (await as('authenticated', user, "select * from dropdown_certificate('test-course')")).rows.length,
        0,
    )
    await as(
        'authenticated',
        user,
        `insert into dropdown_user_progress(user_id,lesson_id,completed,completed_at) values('${user}','${free}',true,now()),('${user}','${paid}',true,now())`,
    )
    const cert = (await as('authenticated', user, "select * from dropdown_certificate('test-course')"))
        .rows[0]
    assert.equal(cert.student_name, 'Studente Test')
    assert.equal(cert.course_title, 'Corso test')
    assert.match(cert.certificate_id, /^DD-/)
})
test('same PayPal order cannot be recorded twice', async () => {
    await assert.rejects(
        db.exec(
            `insert into dropdown_purchases(user_id,course_id,amount_paid,status,paypal_order_id) values('${user}','${course}',15,'completed','ORDER123')`,
        ),
        /unique/,
    )
})
test('admin can edit content; students cannot', async () => {
    assert.equal(
        (
            await as(
                'authenticated',
                user,
                `update dropdown_courses set title='Hacked' where id='${course}' returning id`,
            )
        ).rows.length,
        0,
    )
    assert.equal(
        (
            await as(
                'authenticated',
                admin,
                `update dropdown_lessons set video_id='https://vimeo.com/98765' where id='${paid}' returning id`,
            )
        ).rows.length,
        1,
    )
    await as(
        'authenticated',
        admin,
        `insert into dropdown_free_downloads(title,file_type,file_url) values('Resource','preset','https://example.test/file.zip')`,
    )
})
test('unpublishing hides catalog but retains purchased course access', async () => {
    await as('authenticated', admin, `update dropdown_courses set is_published=false where id='${course}'`)
    assert.equal((await as('anon', null, 'select id from dropdown_courses')).rows.length, 0)
    assert.equal((await as('authenticated', user, 'select id from dropdown_courses')).rows.length, 1)
})
test('refund revokes media and certificate', async () => {
    await db.exec("update dropdown_purchases set status='refunded' where paypal_order_id='ORDER123'")
    assert.equal(
        (await as('authenticated', user, `select * from dropdown_lesson_media('${course}')`)).rows.length,
        0,
    )
    assert.equal(
        (await as('authenticated', user, "select * from dropdown_certificate('test-course')")).rows.length,
        0,
    )
})
test('download migration preserves existing links and is idempotent', async () => {
    const sql = readFileSync('sql/20260910_downloads.sql', 'utf8')
    await db.exec(sql)
    await db.exec(sql)
    assert.equal((await db.query('select * from dropdown_free_downloads')).rows.length, 8)
})

test('payment service can read authoritative prices and record purchases', async () => {
    assert.equal((await as('service_role', null, 'select id,price from dropdown_courses')).rows.length, 1)
})
