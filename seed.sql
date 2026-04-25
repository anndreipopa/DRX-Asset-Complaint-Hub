INSERT INTO department (name) VALUES
    ('IT'),
    ('HR'),
    ('Productie');

INSERT INTO employee (name, email, password_hash, role, dept_id) VALUES
    ('Alexandru Popescu',   'admin@drx.com',    '$2b$10$HZ07xQc1K33dwc3i.IIqnuReZkbcDl3o2RTStUXa4tGPR67NCgIOi',   'ADMIN',            1),
    ('Mihai Ionescu',       'tech1@drx.com',    '$2b$10$dVOQbOX/cqJngX3V5zJc3urS7zNetV2FkU7556ZlDQKrJ48.DvGT.',    'TECHNICIAN',       1),
    ('Diana Popa',          'tech2@drx.com',    '$2b$10$dVOQbOX/cqJngX3V5zJc3urS7zNetV2FkU7556ZlDQKrJ48.DvGT.',    'TECHNICIAN',       1),
    ('Elena Dumitrescu',    'dept1@drx.com',    '$2b$10$30WGZeQk/MUVpqZ.ZUUTwuU0TYcyF2Ocym/GaULPPKnxptDXBKh46',    'DEPT_RESPONSIBLE', 2),
    ('Victor Stan',         'dept2@drx.com',    '$2b$10$30WGZeQk/MUVpqZ.ZUUTwuU0TYcyF2Ocym/GaULPPKnxptDXBKh46',    'DEPT_RESPONSIBLE', 3),
    ('Ion Popescu',         'user1@drx.com',    '$2b$10$IMomYRGMUjT/LhAjjxhgQePBLAh9pLTgf2R.I8ytB8U/dxWPhzMIS',    'USER',             1),
    ('Ana Pavel',           'user2@drx.com',    '$2b$10$IMomYRGMUjT/LhAjjxhgQePBLAh9pLTgf2R.I8ytB8U/dxWPhzMIS',    'USER',             1),
    ('Maria Ionescu',       'user3@drx.com',    '$2b$10$IMomYRGMUjT/LhAjjxhgQePBLAh9pLTgf2R.I8ytB8U/dxWPhzMIS',    'USER',             2),
    ('Cristian Radu',       'user4@drx.com',    '$2b$10$IMomYRGMUjT/LhAjjxhgQePBLAh9pLTgf2R.I8ytB8U/dxWPhzMIS',    'USER',             2),
    ('Andrei Vasilescu',    'user5@drx.com',    '$2b$10$IMomYRGMUjT/LhAjjxhgQePBLAh9pLTgf2R.I8ytB8U/dxWPhzMIS',    'USER',             3),
    ('Dan Marin',           'user6@drx.com',    '$2b$10$IMomYRGMUjT/LhAjjxhgQePBLAh9pLTgf2R.I8ytB8U/dxWPhzMIS',    'USER',             3);

UPDATE department SET responsible_id = 1 WHERE dept_id = 1;
UPDATE department SET responsible_id = 4 WHERE dept_id = 2;
UPDATE department SET responsible_id = 5 WHERE dept_id = 3;

INSERT INTO asset_model (name, category, reliability_score) VALUES
    ('Dell XPS 15',             'LAPTOP',   38.0),
    ('Laptop HP EliteBook',     'LAPTOP',   72.0),
    ('iPhone 14 Pro',           'PHONE',    85.0),
    ('Samsung Galaxy S23',      'PHONE',    91.0),
    ('Sony WH-1000XM5',         'HEADSET',  55.0),
    ('LG 27UK850',              'MONITOR',  93.0),
    ('Logitech MX Keys',        'KEYBOARD', 88.0),
    ('Logitech MX Master 3',    'MOUSE',    90.0);

INSERT INTO asset (model_id, serial_number, empl_id, acquired_at) VALUES
    (1, 'DXL-2024-0891', 6,  '2024-01-15'),
    (1, 'DXL-2024-0892', 7,  '2024-01-15'),
    (1, 'DXL-2024-0893', 8,  '2024-02-01'),
    (1, 'DXL-2024-0894', 10, '2024-02-01'),
    (1, 'DXL-2024-0895', 4,  '2024-03-01'),
    (2, 'HPE-2024-1001', 9,  '2024-03-15'),
    (2, 'HPE-2024-1002', 11, '2024-03-15'),
    (2, 'HPE-2024-1003', 5,  '2024-04-01'),
    (3, 'APL-2023-4521', 6,  '2023-11-01'),
    (3, 'APL-2023-4522', 8,  '2023-11-01'),
    (3, 'APL-2023-4523', 4,  '2023-12-01'),
    (3, 'APL-2023-4524', 5,  '2023-12-01'),
    (4, 'SAM-2024-0011', 7,  '2024-01-10'),
    (4, 'SAM-2024-0012', 9,  '2024-01-10'),
    (4, 'SAM-2024-0013', 10, '2024-02-15'),
    (5, 'SNY-2024-7823', 6,  '2024-02-01'),
    (5, 'SNY-2024-7824', 7,  '2024-02-01'),
    (5, 'SNY-2024-7825', 11, '2024-03-01'),
    (5, 'SNY-2024-7826', 9,  '2024-03-01'),
    (6, 'LGM-2024-1156', 6,  '2024-01-20'),
    (6, 'LGM-2024-1157', 8,  '2024-01-20'),
    (6, 'LGM-2024-1158', 10, '2024-02-10'),
    (7, 'LOG-2025-0034', 7,  '2025-01-05'),
    (7, 'LOG-2025-0035', 9,  '2025-01-05'),
    (7, 'LOG-2025-0036', 11, '2025-02-01'),
    (8, 'MX3-2025-0081', 6,  '2025-01-05'),
    (8, 'MX3-2025-0082', 7,  '2025-01-05'),
    (8, 'MX3-2025-0083', 10, '2025-02-01');

INSERT INTO complaint (title, description, status, resolution_category, asset_id, empl_id, assigned_to, created_at, updated_at, resolved_at) VALUES
    ('Laptop nu porneste dupa update', 'Dupa ultimul update Windows, laptopul nu mai porneste. Ecranul ramane negru.', 'NEW', NULL, 1, 6, NULL, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NULL),
    ('Baterie se descarca in 1 ora', 'Bateria tine maxim 1 ora desi inainte tinea 6 ore. Problema aparuta brusc.', 'IN_REVIEW', NULL, 1, 6, 2, NOW() - INTERVAL '15 days', NOW() - INTERVAL '10 days', NULL),
    ('Supraincalzire la utilizare normala', 'Laptopul se incalzeste foarte tare chiar si la sarcini usoare.', 'RESOLVED', 'HARDWARE_FAULT', 1, 6, 2, NOW() - INTERVAL '45 days', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
    ('Tastatura nu functioneaza partial', 'Tastele F5-F8 nu raspund. Am verificat driverele si problema persista.', 'RESOLVED', 'HARDWARE_FAULT', 1, 6, 3, NOW() - INTERVAL '60 days', NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days'),
    ('Port USB-C defect', 'Portul USB-C din stanga nu mai recunoaste niciun dispozitiv.', 'CLOSED', 'HARDWARE_FAULT', 1, 6, 2, NOW() - INTERVAL '80 days', NOW() - INTERVAL '65 days', NOW() - INTERVAL '65 days'),
    ('Ecran flickering la luminozitate scazuta', 'Ecranul palpaie cand luminozitatea e sub 40%.', 'IN_PROGRESS', NULL, 2, 7, 2, NOW() - INTERVAL '8 days', NOW() - INTERVAL '5 days', NULL),
    ('Laptop restart aleatoriu', 'Laptopul se restarteaza singur de 3-4 ori pe zi fara niciun motiv aparent.', 'RESOLVED', 'HARDWARE_FAULT', 2, 7, 3, NOW() - INTERVAL '35 days', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
    ('Touchpad nu functioneaza', 'Touchpadul nu mai raspunde la gesturi. Mouse-ul extern functioneaza normal.', 'RESOLVED', 'HARDWARE_FAULT', 2, 7, 2, NOW() - INTERVAL '55 days', NOW() - INTERVAL '42 days', NOW() - INTERVAL '42 days'),
    ('Zgomot mecanic la pornire', 'La pornire se aude un zgomot mecanic timp de aproximativ 10 secunde.', 'CLOSED', 'HARDWARE_FAULT', 2, 7, 3, NOW() - INTERVAL '75 days', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'),
    ('Laptop incalzire excesiva', 'Temperatura atinge 95 grade la utilizare Office. Risc de deteriorare.', 'RESOLVED', 'HARDWARE_FAULT', 3, 8, 2, NOW() - INTERVAL '20 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
    ('Display lines orizontale', 'Au aparut linii orizontale pe display in partea de jos a ecranului.', 'REJECTED', NULL, 3, 8, NULL, NOW() - INTERVAL '40 days', NOW() - INTERVAL '38 days', NULL),
    ('Wifi se deconecteaza frecvent', 'Conexiunea wifi cade de 5-6 ori pe ora. Am verificat routerul, problema e la laptop.', 'RESOLVED', 'SOFTWARE_ISSUE', 3, 8, 3, NOW() - INTERVAL '65 days', NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days'),
    ('RAM insuficient - aplicatii crash', 'Aplicatiile Office se inchid brusc. Task manager arata RAM la 98%.', 'IN_REVIEW', NULL, 4, 10, 2, NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days', NULL),
    ('SSD aproape plin', 'Primesc avertisment ca spatiul pe disc e aproape epuizat. SSD 512GB la 490GB.', 'RESOLVED', 'USER_ERROR', 4, 10, 3, NOW() - INTERVAL '30 days', NOW() - INTERVAL '22 days', NOW() - INTERVAL '22 days'),
    ('Laptop nu se incarca', 'Incarcatorul nu mai functioneaza. Indicator LED nu se aprinde.', 'RESOLVED', 'HARDWARE_FAULT', 4, 10, 2, NOW() - INTERVAL '70 days', NOW() - INTERVAL '58 days', NOW() - INTERVAL '58 days'),
    ('Blocat la boot - Windows corruption', 'Laptopul nu mai booteaza, afiseaza eroare BOOTMGR is missing.', 'RESOLVED', 'SOFTWARE_ISSUE', 5, 4, 2, NOW() - INTERVAL '25 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
    ('Microfon intern nu functioneaza', 'In cadrul apelurilor video, interlocutorii nu ma aud. Microfon extern functioneaza.', 'CLOSED', 'HARDWARE_FAULT', 5, 4, 3, NOW() - INTERVAL '55 days', NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days'),
    ('HP - Actualizare BIOS esuata', 'Dupa tentativa de update BIOS, laptopul nu mai porneste normal.', 'RESOLVED', 'SOFTWARE_ISSUE', 6, 9, 2, NOW() - INTERVAL '18 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
    ('HP - Tastatura taste lipite', 'Tastele G si H necesita apasare puternica pentru a functiona.', 'IN_PROGRESS', NULL, 7, 11, 3, NOW() - INTERVAL '7 days', NOW() - INTERVAL '4 days', NULL),
    ('HP - Ecran ingalbenire margini', 'Marginile ecranului au o nuanta galbena vizibila pe fundaluri albe.', 'NEW', NULL, 8, 5, NULL, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days', NULL),
    ('iPhone - Baterie se descarca rapid', 'Bateria telefonului tine maxim 4 ore. Inainte tinea o zi intreaga.', 'IN_PROGRESS', NULL, 9, 6, 2, NOW() - INTERVAL '12 days', NOW() - INTERVAL '8 days', NULL),
    ('iPhone - Ecran spart colt dreapta', 'Telefonul a cazut si ecranul s-a spart in coltul din dreapta sus.', 'RESOLVED', 'PHYSICAL_DAMAGE', 10, 8, 3, NOW() - INTERVAL '20 days', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
    ('iPhone - Nu se conecteaza la WiFi corporate', 'Telefonul nu se poate conecta la reteaua WiFi a companiei desi parola e corecta.', 'RESOLVED', 'SOFTWARE_ISSUE', 11, 4, 2, NOW() - INTERVAL '40 days', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
    ('Casti Bluetooth - nu functioneaza noise cancelling', 'Functia de noise cancelling nu mai functioneaza. Sunet normal ok.', 'RESOLVED', 'HARDWARE_FAULT', 16, 6, 3, NOW() - INTERVAL '22 days', NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'),
    ('Casti - microfon produce zgomot static', 'In timpul apelurilor se aude un zgomot static constant din microfon.', 'IN_REVIEW', NULL, 17, 7, 2, NOW() - INTERVAL '6 days', NOW() - INTERVAL '4 days', NULL),
    ('Casti nu se incarca prin USB-C', 'Portul USB-C al castilor nu mai accepta incarcarea. Baterie la 0%.', 'RESOLVED', 'HARDWARE_FAULT', 18, 11, 3, NOW() - INTERVAL '35 days', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
    ('Casti - o ureche nu produce sunet', 'Urechea stanga a castilor nu produce sunet. Urechea dreapta functioneaza normal.', 'NEW', NULL, 19, 9, NULL, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days', NULL),
    ('Monitor flickering la rezolutie 4K', 'La rezolutia 4K 60Hz monitorul palpaie. La 1440p functioneaza normal.', 'RESOLVED', 'SOFTWARE_ISSUE', 20, 6, 2, NOW() - INTERVAL '50 days', NOW() - INTERVAL '38 days', NOW() - INTERVAL '38 days'),
    ('Tastatura - taste nefunctionale dupa varsare lichid', 'S-a varsat cafea pe tastatura. Mai multe taste nu mai functioneaza.', 'RESOLVED', 'PHYSICAL_DAMAGE', 23, 7, 3, NOW() - INTERVAL '28 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
    ('Mouse scroll defect', 'Rotita de scroll a mouse-ului sare peste pagini la scroll incet.', 'CLOSED', 'HARDWARE_FAULT', 26, 6, 2, NOW() - INTERVAL '60 days', NOW() - INTERVAL '48 days', NOW() - INTERVAL '48 days'),
    ('Dell - ventilator zgomotos', 'Ventilatorul produce un zgomot puternic constant chiar si in idle.', 'RESOLVED', 'HARDWARE_FAULT', 1, 6, 2, NOW() - INTERVAL '85 days', NOW() - INTERVAL '70 days', NOW() - INTERVAL '70 days'),
    ('Dell - ecran se inchide singur', 'Ecranul se inchide aleatoriu fara a fi in modul sleep.', 'RESOLVED', 'HARDWARE_FAULT', 2, 7, 3, NOW() - INTERVAL '88 days', NOW() - INTERVAL '75 days', NOW() - INTERVAL '75 days'),
    ('Dell - port HDMI nu functioneaza', 'Portul HDMI nu transmite semnal catre monitor extern.', 'CLOSED', 'HARDWARE_FAULT', 3, 8, 2, NOW() - INTERVAL '72 days', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'),
    ('Dell - tastatura taste blocate', 'Doua taste sunt complet blocate si nu raspund la apasare.', 'RESOLVED', 'HARDWARE_FAULT', 4, 10, 3, NOW() - INTERVAL '50 days', NOW() - INTERVAL '38 days', NOW() - INTERVAL '38 days'),
    ('Dell - display negru la pornire', 'Display-ul ramane negru la pornire, laptopul functioneaza dar nu afiseaza nimic.', 'RESOLVED', 'HARDWARE_FAULT', 5, 4, 2, NOW() - INTERVAL '42 days', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
    ('Dell - baterie nu se detecteaza', 'Sistemul nu detecteaza bateria. Laptopul functioneaza doar conectat la curent.', 'NEW', NULL, 1, 6, NULL, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days', NULL),
    ('Dell - camera web nu functioneaza', 'Camera web nu este recunoscuta in Device Manager. Driverele sunt actualizate.', 'IN_REVIEW', NULL, 2, 7, 2, NOW() - INTERVAL '9 days', NOW() - INTERVAL '6 days', NULL),
    ('Dell - touchscreen nu raspunde', 'Ecranul tactil nu mai raspunde la atingere dupa un update de driver.', 'RESOLVED', 'SOFTWARE_ISSUE', 3, 8, 3, NOW() - INTERVAL '33 days', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
    ('Dell - SSD face zgomot', 'Se aude un zgomot de click din zona SSD-ului la operatii de citire.', 'RESOLVED', 'HARDWARE_FAULT', 4, 10, 2, NOW() - INTERVAL '58 days', NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days'),
    ('Dell - conectare lenta la retea', 'Laptopul se conecteaza la retea in aproximativ 3 minute dupa pornire.', 'RESOLVED', 'SOFTWARE_ISSUE', 5, 4, 3, NOW() - INTERVAL '37 days', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
    ('Samsung - ecran zgariet', 'Ecranul are o zgarietura vizibila dupa cadere accidentala.', 'RESOLVED', 'PHYSICAL_DAMAGE', 13, 7, 2, NOW() - INTERVAL '44 days', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
    ('Samsung - aplicatie email crash', 'Aplicatia de email se inchide singura la fiecare 10-15 minute.', 'RESOLVED', 'SOFTWARE_ISSUE', 14, 9, 3, NOW() - INTERVAL '26 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
    ('Samsung - difuzor distorsionat', 'Sunetul difuzorului este distorsionat la volum mediu si mare.', 'IN_REVIEW', NULL, 15, 10, 2, NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days', NULL),
    ('iPhone - TouchID nu functioneaza', 'Senzorul de amprenta nu mai recunoaste amprentele inregistrate.', 'RESOLVED', 'HARDWARE_FAULT', 12, 5, 3, NOW() - INTERVAL '31 days', NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'),
    ('Monitor - culori incorecte', 'Culorile afisate sunt distorsionate, tonuri de rosu excesive.', 'RESOLVED', 'USER_ERROR', 21, 8, 2, NOW() - INTERVAL '19 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
    ('Monitor - pixel mort', 'Un pixel mort vizibil in centrul ecranului pe fundaluri deschise.', 'CLOSED', 'HARDWARE_FAULT', 22, 10, 3, NOW() - INTERVAL '66 days', NOW() - INTERVAL '52 days', NOW() - INTERVAL '52 days'),
    ('Tastatura - conexiune Bluetooth instabila', 'Tastatura se deconecteaza de la Bluetooth de mai multe ori pe ora.', 'IN_PROGRESS', NULL, 24, 9, 2, NOW() - INTERVAL '11 days', NOW() - INTERVAL '7 days', NULL),
    ('Mouse - click stanga dublu neintenționat', 'Click-ul stanga inregistreaza dublu click la o singura apasare.', 'RESOLVED', 'HARDWARE_FAULT', 27, 7, 3, NOW() - INTERVAL '23 days', NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'),
    ('HP - baterie umflata', 'Bateria pare umflata, capacul din spate nu mai inchide complet.', 'IN_REVIEW', NULL, 6, 9, 2, NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days', NULL),
    ('Casti - banda de sustinere rupta', 'Banda superioara a castilor s-a rupt la imbinare dupa utilizare normala.', 'RESOLVED', 'HARDWARE_FAULT', 16, 6, 2, NOW() - INTERVAL '47 days', NOW() - INTERVAL '35 days', NOW() - INTERVAL '35 days');

INSERT INTO complaint_workflow (complaint_id, changed_by, old_status, new_status, changed_at)
SELECT c.complaint_id, c.empl_id, NULL, 'NEW', c.created_at
FROM complaint c;

INSERT INTO complaint_workflow (complaint_id, changed_by, old_status, new_status, changed_at)
SELECT c.complaint_id, COALESCE(c.assigned_to, 2), 'NEW', 'IN_REVIEW', c.created_at + INTERVAL '2 hours'
FROM complaint c
WHERE c.status IN ('IN_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED');

INSERT INTO complaint_workflow (complaint_id, changed_by, old_status, new_status, changed_at)
SELECT c.complaint_id, COALESCE(c.assigned_to, 2), 'IN_REVIEW', 'IN_PROGRESS', c.created_at + INTERVAL '1 day'
FROM complaint c
WHERE c.status IN ('IN_PROGRESS', 'RESOLVED', 'CLOSED');

INSERT INTO complaint_workflow (complaint_id, changed_by, old_status, new_status, changed_at)
SELECT c.complaint_id, COALESCE(c.assigned_to, 2), 'IN_PROGRESS', c.status, c.resolved_at
FROM complaint c
WHERE c.status IN ('RESOLVED', 'CLOSED') AND c.resolved_at IS NOT NULL;

INSERT INTO complaint_workflow (complaint_id, changed_by, old_status, new_status, changed_at)
SELECT c.complaint_id, 2, 'IN_REVIEW', 'REJECTED', c.created_at + INTERVAL '3 hours'
FROM complaint c
WHERE c.status = 'REJECTED';

INSERT INTO notification (empl_id, complaint_id, message, is_read, created_at)
SELECT 2, c.complaint_id, 'Complaint noua: ' || c.title,
    CASE WHEN c.status = 'NEW' THEN FALSE ELSE TRUE END, c.created_at
FROM complaint c
WHERE c.status IN ('NEW', 'IN_REVIEW', 'IN_PROGRESS');

INSERT INTO notification (empl_id, complaint_id, message, is_read, created_at)
SELECT 3, c.complaint_id, 'Complaint noua: ' || c.title,
    CASE WHEN c.status = 'NEW' THEN FALSE ELSE TRUE END, c.created_at
FROM complaint c
WHERE c.status IN ('NEW', 'IN_REVIEW', 'IN_PROGRESS');