-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "completed" BOOLEAN DEFAULT false,
    "create_ts" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_ts" DATE,
    "last_update_ts" DATE,

    CONSTRAINT "pk_tasks" PRIMARY KEY ("id")
);
