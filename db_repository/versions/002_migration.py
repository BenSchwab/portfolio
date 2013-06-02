from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
blog_tags = Table('blog_tags', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('picture', String),
    Column('name', String),
)

tag_table = Table('tag_table', post_meta,
    Column('tag_id', Integer),
    Column('blog_id', Integer),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['blog_tags'].create()
    post_meta.tables['tag_table'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['blog_tags'].drop()
    post_meta.tables['tag_table'].drop()
