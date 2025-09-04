import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('article_design', {
        id: { type: 'serial', primaryKey: true },
        user_id: { type: 'integer', notNull: true },
        title: { type: 'varchar(50)', notNull: true, default: '' },
        summary: { type: 'varchar(250)', notNull: true, default: '' },
        chapter_design: { type: 'jsonb', notNull: true, default: '{}' },
        histories: { type: 'text', notNull: true, default: '' },
        cur_chapter: { type: 'integer', notNull: true, default: 0 },
        create_at: {
            notNull: true,
            type: 'timestamptz',
            default: pgm.func('current_timestamp')
        }
    });

    pgm.createTable('article_chapter', {
        id: { type: 'serial', primaryKey: true },
        article_id: { type: 'integer', notNull: true },
        chapter: { type: 'integer', notNull: true },
        content: { type: 'text', notNull: true, default: '' },
        create_at: {
            notNull: true,
            type: 'timestamptz',
            default: pgm.func('current_timestamp')
        }
    });

    pgm.addConstraint('article_chapter', 'article_chapter_article_id_fkey', {
        foreignKeys: {
            columns: 'article_id',
            references: 'article_design(id)',
            onDelete: 'CASCADE'
        }
    });

    pgm.addConstraint('article_design', 'article_design_user_id_fkey', {
        foreignKeys: {
            columns: 'user_id',
            references: 'users(id)',
            onDelete: 'CASCADE'
        }
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('article_design');
    pgm.dropTable('article_chapter');
}
