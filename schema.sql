DROP TABLE IF EXISTS notification CASCADE;
DROP TABLE IF EXISTS complaint_workflow CASCADE;
DROP TABLE IF EXISTS complaint_comment CASCADE;
DROP TABLE IF EXISTS complaint CASCADE;
DROP TABLE IF EXISTS asset CASCADE;
DROP TABLE IF EXISTS asset_model CASCADE;
DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS department CASCADE;

CREATE TABLE department (
    dept_id         SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    responsible_id  INT
);

CREATE TABLE employee (
    empl_id         SERIAL PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    email           VARCHAR(150)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    role            VARCHAR(30)     NOT NULL CHECK (role IN ('USER', 'TECHNICIAN', 'DEPT_RESPONSIBLE', 'ADMIN')),
    dept_id         INT             NOT NULL REFERENCES department(dept_id),
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

ALTER TABLE department
    ADD CONSTRAINT fk_dept_responsible
    FOREIGN KEY (responsible_id) REFERENCES employee(empl_id);

CREATE TABLE asset_model (
    model_id            SERIAL PRIMARY KEY,
    name                VARCHAR(100)    NOT NULL,
    category            VARCHAR(30)     NOT NULL CHECK (category IN ('LAPTOP', 'PHONE', 'HEADSET', 'MONITOR', 'KEYBOARD', 'MOUSE', 'OTHER')),
    reliability_score   FLOAT           NOT NULL DEFAULT 100.0
);

CREATE TABLE asset (
    asset_id        SERIAL PRIMARY KEY,
    model_id        INT             NOT NULL REFERENCES asset_model(model_id),
    serial_number   VARCHAR(100)    NOT NULL UNIQUE,
    empl_id         INT             REFERENCES employee(empl_id),
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    acquired_at     DATE            NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE complaint (
    complaint_id            SERIAL PRIMARY KEY,
    title                   VARCHAR(200)    NOT NULL,
    description             TEXT            NOT NULL,
    status                  VARCHAR(20)     NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'IN_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED')),
    resolution_category     VARCHAR(30)     CHECK (resolution_category IN ('USER_ERROR', 'HARDWARE_FAULT', 'SOFTWARE_ISSUE', 'PHYSICAL_DAMAGE')),
    asset_id                INT             NOT NULL REFERENCES asset(asset_id),
    empl_id                 INT             NOT NULL REFERENCES employee(empl_id),
    assigned_to             INT             REFERENCES employee(empl_id),
    created_at              TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP       NOT NULL DEFAULT NOW(),
    resolved_at             TIMESTAMP
);

CREATE TABLE complaint_comment (
    comment_id      SERIAL PRIMARY KEY,
    complaint_id    INT         NOT NULL REFERENCES complaint(complaint_id),
    empl_id         INT         NOT NULL REFERENCES employee(empl_id),
    message         TEXT        NOT NULL,
    is_official     BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE TABLE complaint_workflow (
    workflow_id     SERIAL PRIMARY KEY,
    complaint_id    INT             NOT NULL REFERENCES complaint(complaint_id),
    changed_by      INT             NOT NULL REFERENCES employee(empl_id),
    old_status      VARCHAR(20),
    new_status      VARCHAR(20)     NOT NULL,
    note            TEXT,
    changed_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE TABLE notification (
    notification_id SERIAL PRIMARY KEY,
    empl_id         INT         NOT NULL REFERENCES employee(empl_id),
    complaint_id    INT         NOT NULL REFERENCES complaint(complaint_id),
    message         TEXT        NOT NULL,
    is_read         BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_complaint_status      ON complaint(status);
CREATE INDEX idx_complaint_asset       ON complaint(asset_id);
CREATE INDEX idx_complaint_empl        ON complaint(empl_id);
CREATE INDEX idx_complaint_assigned    ON complaint(assigned_to);
CREATE INDEX idx_complaint_created     ON complaint(created_at);
CREATE INDEX idx_asset_model           ON asset(model_id);
CREATE INDEX idx_asset_empl            ON asset(empl_id);
CREATE INDEX idx_notification_empl     ON notification(empl_id);
CREATE INDEX idx_notification_read     ON notification(is_read);
CREATE INDEX idx_workflow_complaint    ON complaint_workflow(complaint_id);