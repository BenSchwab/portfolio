from app import db
from werkzeug.security import generate_password_hash, check_password_hash

ROLE_USER = 0
ROLE_ADMIN = 1

#TODO add methods for adding tags?

tag_table = db.Table('tag_table',
    db.Column('tag_id', db.Integer, db.ForeignKey('blog_post.id')),
    db.Column('blog_id', db.Integer, db.ForeignKey('blog_tags.id'))
)

class Admin(db.Model):
    __tablename__ = 'admin'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String)
    pw_hash = db.Column(db.String)
    def __init__(self, username, password):
        self.username = username
        self.set_password(password)

    def set_password(self, password):
        self.pw_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.pw_hash, password)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.id)

class BlogPost(db.Model):
    __tablename__ = 'blog_post'
    id = db.Column(db.Integer, primary_key = True)
    blogTitle = db.Column(db.String)
    date = db.Column(db.DateTime)
    content = db.Column(db.String)
    previewImage = db.Column(db.String)
    preview = db.Column(db.String)
    published = db.Column(db.Boolean)
    def getDate(self):
        print self.date.date()


    def __repr__(self):
        return ""

class BlogComment(db.Model):
    __tablename__ = 'blog_comment'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String)
    date = db.Column(db.DateTime)
    score = db.Column(db.Integer)
    content = db.Column(db.String)
    blog_id = db.Column(db.Integer, db.ForeignKey('blog_post.id'))
    blog = db.relationship("BlogPost", backref = db.backref('comments'))
    views = db.Column(db.Integer)


    def __repr__(self):
        return ""

class BlogTag(db.Model):
    __tablename__ = "blog_tags"
    id = db.Column(db.Integer, primary_key = True)
    picture = db.Column(db.String())
    name = db.Column(db.String())
    blogs = db.relationship('BlogPost',secondary = tag_table, primaryjoin = (tag_table.c.tag_id == id),secondaryjoin = (tag_table.c.blog_id == id), backref = db.backref('tags', lazy = 'dynamic'), lazy = 'dynamic')
