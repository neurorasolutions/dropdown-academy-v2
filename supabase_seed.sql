-- Seed courses, modules, and lessons


-- Course: Synth Modulare Completo
INSERT INTO public.courses (id, slug, title, description, price, thumbnail_url, category, level, is_published)
VALUES ('f4898dd5-8c51-4f28-b896-579225481677', 'synth-modulare-completo', 'Synth Modulare Completo', 'Corso di Sound Design e Sintesi Modulare con VCV Rack.', 50, '/images/courses/synth_modulare_completo.jpg', 'modulare', 'intermediate', true);
INSERT INTO public.course_modules (id, course_id, title, order_index)
VALUES ('516757ce-74b8-4f2f-bcc2-4d5cef2398c9', 'f4898dd5-8c51-4f28-b896-579225481677', 'Modulo 1: Introduzione alla Sintesi Modulare', 1);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('39dcef73-aa74-49d7-a3f9-b2348b70b76d', '516757ce-74b8-4f2f-bcc2-4d5cef2398c9', 'Lezione 1 – Tipologie di Sintetizzatori', 15, 1, true);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('4db48660-22ab-4b02-a25f-0516eb8f34ef', '516757ce-74b8-4f2f-bcc2-4d5cef2398c9', 'Lezione 2 – Primi Collegamenti e Modulazioni Base', 18, 2, true);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('9beb62f3-5a8b-4259-87d5-7da1018364d9', '516757ce-74b8-4f2f-bcc2-4d5cef2398c9', 'Lezione 3 – Oscillatori e Forme d’Onda', 22, 3, false);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('21cfe4cb-a15b-4336-a620-c6c6ae448fa3', '516757ce-74b8-4f2f-bcc2-4d5cef2398c9', 'Lezione 4 – v/oct, Gate e Controllo via Tastiera', 20, 4, false);
INSERT INTO public.course_modules (id, course_id, title, order_index)
VALUES ('19855aa2-a2c8-4e5d-a215-33f3dbca0de5', 'f4898dd5-8c51-4f28-b896-579225481677', 'Modulo 2: Tecniche di Sintesi', 2);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('9aa39b9c-f8b0-478b-924e-64357e7690d2', '19855aa2-a2c8-4e5d-a215-33f3dbca0de5', 'Lezione 5 – Esperimenti in Sintesi Additiva', 25, 1, false);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('93f4fcbd-e02c-4c77-b3b8-9d68df6d965f', '19855aa2-a2c8-4e5d-a215-33f3dbca0de5', 'Lezione 6 – Sintesi Sottrattiva e Filtri', 22, 2, false);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('6f75719c-3665-4fba-9ca8-d617cc1c70c4', '19855aa2-a2c8-4e5d-a215-33f3dbca0de5', 'Lezione 7 – Esperimenti con i Filtri', 28, 3, false);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('fb310701-e83d-4cd3-9734-838931293e3f', '19855aa2-a2c8-4e5d-a215-33f3dbca0de5', 'Lezione 8 – Approfondimento sui Moduli NANO Modules', 24, 4, false);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('49db2c36-593b-475d-8e97-0f78c785f4e0', '19855aa2-a2c8-4e5d-a215-33f3dbca0de5', 'Lezione 9 – Sintesi FM e Cross FM', 29, 5, false);

-- Course: Ableton Live Masterclass
INSERT INTO public.courses (id, slug, title, description, price, thumbnail_url, category, level, is_published)
VALUES ('f926f65d-c2a8-4657-8942-d68e07f674e8', 'ableton-live-masterclass', 'Ableton Live Masterclass', 'Corso completo passo dopo passo per dominare Ableton Live.', 60, '/images/courses/ableton_live_masterclass.jpg', 'ableton', 'beginner', true);
INSERT INTO public.course_modules (id, course_id, title, order_index)
VALUES ('c9b8041d-a224-4e35-bfc7-a9960a9716eb', 'f926f65d-c2a8-4657-8942-d68e07f674e8', 'Setup e Configurazione', 1);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('1b14954b-1fb6-40e9-a2ed-d00504ad735e', 'c9b8041d-a224-4e35-bfc7-a9960a9716eb', 'Installazione e preferenze', 15, 1, true);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('2f925bb4-3144-4c1e-acb1-8867da06862a', 'c9b8041d-a224-4e35-bfc7-a9960a9716eb', 'Audio e MIDI settings', 20, 2, true);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('d0cf31d8-5ce3-45ca-8587-a81e3ff16837', 'c9b8041d-a224-4e35-bfc7-a9960a9716eb', 'Template personalizzato', 25, 3, false);
INSERT INTO public.course_modules (id, course_id, title, order_index)
VALUES ('de27b185-7188-4b2f-8b9b-5adc83ab66bc', 'f926f65d-c2a8-4657-8942-d68e07f674e8', 'Session View & Produzione', 2);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('31941f9a-8fd1-4ef5-af35-d401ec8281ca', 'de27b185-7188-4b2f-8b9b-5adc83ab66bc', 'Clip e Scene', 22, 1, false);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('334b87b3-e20e-4ebf-8419-5fb6efd5fade', 'de27b185-7188-4b2f-8b9b-5adc83ab66bc', 'Warping audio', 28, 2, false);

-- Course: Serum Sound Design
INSERT INTO public.courses (id, slug, title, description, price, thumbnail_url, category, level, is_published)
VALUES ('6efb28b4-ca27-454d-b083-16cd3ff27792', 'serum-sound-design', 'Serum Sound Design', 'Crea suoni unici con il wavetable synth più potente del mondo.', 60, '/images/courses/serum_sound_design.jpg', 'serum', 'advanced', true);
INSERT INTO public.course_modules (id, course_id, title, order_index)
VALUES ('395ecba6-ef5d-46da-9828-e902b4e6e65c', '6efb28b4-ca27-454d-b083-16cd3ff27792', 'Interfaccia e Generatori', 1);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('6c0f6ecd-d8ca-4014-9981-238558edd8f3', '395ecba6-ef5d-46da-9828-e902b4e6e65c', 'Panoramica della GUI', 15, 1, true);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('e660dd6a-f8fe-4fd8-8091-042313b92a73', '395ecba6-ef5d-46da-9828-e902b4e6e65c', 'Gli Oscillatori A e B', 20, 2, true);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('dc4d5499-513f-4d83-86f0-913700de0be2', '395ecba6-ef5d-46da-9828-e902b4e6e65c', 'Sub ed Noise Generator', 18, 3, false);
INSERT INTO public.course_modules (id, course_id, title, order_index)
VALUES ('572544ea-26d6-4dbd-a9f3-74f8299c5db3', '6efb28b4-ca27-454d-b083-16cd3ff27792', 'Modulazione ed Inviluppi', 2);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('959959f9-468b-4a6d-8113-8aa36bfdc2d3', '572544ea-26d6-4dbd-a9f3-74f8299c5db3', 'LFO avanzati e LFO shaping', 22, 1, false);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('37fdb397-278e-4ef4-9f05-865a67712245', '572544ea-26d6-4dbd-a9f3-74f8299c5db3', 'Inviluppi e Modulation Matrix', 26, 2, false);
INSERT INTO public.course_modules (id, course_id, title, order_index)
VALUES ('217ad2f5-ac3c-4b41-86fc-89fdac3dc787', '6efb28b4-ca27-454d-b083-16cd3ff27792', 'Sound Design Pratico', 3);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('9f920adb-0f59-4d1f-8c8f-50a51b48761f', '217ad2f5-ac3c-4b41-86fc-89fdac3dc787', 'Creare un Bass Lead Aggressivo', 28, 1, false);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('474aaf5e-5b82-4786-8f40-5a4238cf3f82', '217ad2f5-ac3c-4b41-86fc-89fdac3dc787', 'Drone e Pad Ambient Evolutivi', 25, 2, false);

-- Course: Max MSP Fondamenti
INSERT INTO public.courses (id, slug, title, description, price, thumbnail_url, category, level, is_published)
VALUES ('4e40cb96-178d-417c-8459-186f75feadfa', 'max-msp-fondamenti', 'Max MSP Fondamenti', 'Corso completo per la programmazione audio-visuale con Max/MSP.', 60, '/images/courses/max_msp_fondamenti.jpg', 'max-msp', 'intermediate', true);
INSERT INTO public.course_modules (id, course_id, title, order_index)
VALUES ('a78a6a35-cc15-42dd-84b0-4f17c7df5b01', '4e40cb96-178d-417c-8459-186f75feadfa', 'Capitolo 1 & 2: Basi di Max MSP', 1);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('11eaf956-ded7-4091-93b6-094c4d152528', 'a78a6a35-cc15-42dd-84b0-4f17c7df5b01', 'Lezione 1: Il suono, forme d''onda, frequenza e ampiezza', 18, 1, true);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('a65923e6-03c2-4196-8e36-c0c60c20a26b', 'a78a6a35-cc15-42dd-84b0-4f17c7df5b01', 'Lezione 2: Primi Passi - applicazione di frequenza e ampiezza', 22, 2, true);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('5f8aada6-b302-4ad0-9b73-cd31d0fe27f9', 'a78a6a35-cc15-42dd-84b0-4f17c7df5b01', 'Lezione 3: Operatori binari, casualità, messaggi e astrazioni', 20, 3, false);
INSERT INTO public.course_modules (id, course_id, title, order_index)
VALUES ('ba79863b-d1c2-4534-8776-81c2e838e437', '4e40cb96-178d-417c-8459-186f75feadfa', 'Capitolo 3: Campionamento e MIDI', 2);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('14fc7d18-9a97-4fdb-9a27-41096f4cc3f3', 'ba79863b-d1c2-4534-8776-81c2e838e437', 'Lezione 4: Campionamento e quantizzazione audio', 24, 1, false);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('e675fbfb-d001-48bc-8ee5-62c4aa55bc14', 'ba79863b-d1c2-4534-8776-81c2e838e437', 'Lezione 5: Il protocollo MIDI e la struttura esadecimale', 27, 2, false);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('83dda781-2ac4-43bf-9c91-2434ce3c9264', 'ba79863b-d1c2-4534-8776-81c2e838e437', 'Lezione 6: Pratica MIDI - patch monofoniche e polifoniche', 25, 3, false);
INSERT INTO public.course_modules (id, course_id, title, order_index)
VALUES ('49aa871e-6afa-41ce-9d6e-168d77d96007', '4e40cb96-178d-417c-8459-186f75feadfa', 'Capitolo 4, 5 & 6: Filtri, Effetti e Compressione', 3);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('0d4f2f39-9e6b-4b8c-8710-39d49405b756', '49aa871e-6afa-41ce-9d6e-168d77d96007', 'Lezione 7: Filtri FIR/IIR di primo e secondo ordine', 22, 1, false);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('f9cdd7f9-b23d-4f97-993b-61b2de8c1d11', '49aa871e-6afa-41ce-9d6e-168d77d96007', 'Lezione 8: Costruzione di equalizzatori grafici', 26, 2, false);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('64318105-8584-4084-8643-d286913b3550', '49aa871e-6afa-41ce-9d6e-168d77d96007', 'Lezione 9: Linee di ritardo - Delay, Flanger, Phaser, Chorus', 24, 3, false);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('72ede6fb-6041-4fce-86e0-c722da29f486', '49aa871e-6afa-41ce-9d6e-168d77d96007', 'Lezione 10: Costruzione di effetti audio e delay multibanda', 29, 4, false);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('2870b1e3-fd3b-4e00-a0d5-46d1cc2d2e5b', '49aa871e-6afa-41ce-9d6e-168d77d96007', 'Lezione 11: L''algoritmo di un compressore audio', 21, 5, false);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('84654943-6b43-4080-8d64-052d0ba67abd', '49aa871e-6afa-41ce-9d6e-168d77d96007', 'Lezione 12: Costruzione pratica del compressore', 28, 6, false);

-- Course: Pigments Masterclass
INSERT INTO public.courses (id, slug, title, description, price, thumbnail_url, category, level, is_published)
VALUES ('bc1a53b4-1927-420b-9193-417fb510d536', 'pigments-masterclass', 'Pigments Masterclass', 'Masterclass per il sintetizzatore Arturia Pigments 4.', 15, '/images/courses/pigments_masterclass.jpg', 'pigments', 'beginner', true);
INSERT INTO public.course_modules (id, course_id, title, order_index)
VALUES ('43c182b4-1276-4ce3-8c8a-81d64c92409d', 'bc1a53b4-1927-420b-9193-417fb510d536', 'I Motori di Sintesi', 1);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('a3f0f7aa-9fe7-4cf2-801a-8e938169db53', '43c182b4-1276-4ce3-8c8a-81d64c92409d', 'L''interfaccia grafica ed il browser patch', 12, 1, true);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('988fbd2a-ad1c-4e50-8e33-8c45427c95f1', '43c182b4-1276-4ce3-8c8a-81d64c92409d', 'Engine Wavetable e Analogico', 22, 2, true);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('aeee7c45-d821-4104-bc24-a98bbf061f40', '43c182b4-1276-4ce3-8c8a-81d64c92409d', 'Engine Sample e Sintesi Granulare', 25, 3, false);
INSERT INTO public.course_modules (id, course_id, title, order_index)
VALUES ('60ab4d90-6237-47bc-bf91-bc9be9d5bb9c', 'bc1a53b4-1927-420b-9193-417fb510d536', 'Modulazione ed FX', 2);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('76942cb5-89cc-434b-a182-f69795ace5b0', '60ab4d90-6237-47bc-bf91-bc9be9d5bb9c', 'Modulatori: LFO, Funzioni e Randomizer', 24, 1, false);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('a6abe00b-f830-4a28-863b-2e8b1353e010', '60ab4d90-6237-47bc-bf91-bc9be9d5bb9c', 'Routing degli effetti e arpeggiatore', 20, 2, false);

-- Course: Reaktor Blocks Completo
INSERT INTO public.courses (id, slug, title, description, price, thumbnail_url, category, level, is_published)
VALUES ('8e52355d-1895-46af-bdfe-4559e15f7569', 'reaktor-blocks', 'Reaktor Blocks Completo', 'Modular nel box con Native Instruments Reaktor Blocks.', 50, '/images/courses/reaktor_blocks.jpg', 'modulare', 'advanced', true);
INSERT INTO public.course_modules (id, course_id, title, order_index)
VALUES ('c3518a8f-9ad4-41d8-847e-1f7a660227b9', '8e52355d-1895-46af-bdfe-4559e15f7569', 'I Blocks Fondamentali', 1);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('c0bbf6f0-6c33-49a4-bf83-462f30105caa', 'c3518a8f-9ad4-41d8-847e-1f7a660227b9', 'Introduzione a Reaktor Blocks', 14, 1, true);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('a9fd9c3a-8719-41d8-9c84-25152307037d', 'c3518a8f-9ad4-41d8-847e-1f7a660227b9', 'Bento Box Blocks: VCO, VCF, VCA', 22, 2, true);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('74886187-b94f-4a7b-8c13-bf53aa398a0f', 'c3518a8f-9ad4-41d8-847e-1f7a660227b9', 'Inviluppi e LFO modulari', 18, 3, false);
INSERT INTO public.course_modules (id, course_id, title, order_index)
VALUES ('3303ba90-4990-4d92-b870-7fb71e00dc71', '8e52355d-1895-46af-bdfe-4559e15f7569', 'Patching Avanzato', 2);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('b9ba62fe-01d3-4e19-b745-623d10fb5744', '3303ba90-4990-4d92-b870-7fb71e00dc71', 'Sintesi FM e Modulazioni incrociate', 26, 1, false);
INSERT INTO public.lessons (id, module_id, title, video_duration, order_index, is_free)
VALUES ('3157d155-60c4-4fbb-9031-7ebbf67f149d', '3303ba90-4990-4d92-b870-7fb71e00dc71', 'Patch Generative e Sequencer casuali', 28, 2, false);
