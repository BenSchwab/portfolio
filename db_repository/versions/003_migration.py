from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
admin = Table('admin', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('name', String),
    Column('pw_hash', String),
)

blog_post = Table('blog_post', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('date', DateTime),
    Column('content', String),
    Column('previewImage', String),
    Column('preview', String),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['admin'].create()
    post_meta.tables['blog_post'].columns['preview'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['admin'].drop()
    post_meta.tables['blog_post'].columns['preview'].drop()
