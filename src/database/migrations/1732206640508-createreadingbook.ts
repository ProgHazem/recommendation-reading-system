import { MigrationInterface, QueryRunner } from 'typeorm';

export class Createreadingbook1732206640508 implements MigrationInterface {
  name = 'Createreadingbook1732206640508';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reading_books" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "start_page" integer NOT NULL, "end_page" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid, "book_id" uuid, CONSTRAINT "PK_cfec1220daee19f59269cd9dda1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "reading_books" ADD CONSTRAINT "FK_80d6eae517352e99904dd3f147b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reading_books" ADD CONSTRAINT "FK_8d462ee1fb518bb6cb74565c54e" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reading_books" DROP CONSTRAINT "FK_8d462ee1fb518bb6cb74565c54e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reading_books" DROP CONSTRAINT "FK_80d6eae517352e99904dd3f147b"`,
    );
    await queryRunner.query(`DROP TABLE "reading_books"`);
  }
}
