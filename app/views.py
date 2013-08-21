from flask import request, redirect, render_template, url_for, g
from flask.ext.login import login_user, logout_user, current_user, login_required
from flask.views import MethodView
from flask import jsonify
from forms import LoginForm, BlogForm
from app import app, db, lm
from app.models import BlogPost, BlogComment, Admin
from datetime import datetime
import os

@app.before_request
def before_request():
    g.user = current_user

#There might be bugs here..
@lm.user_loader
def load_user(userid):
    return Admin.query.get(int(userid))

@app.route('/', methods = ['GET', 'POST'])
@app.route('/index', methods = ['GET', 'POST'])
def index():
    return render_template("main.html")

@app.route('/blog/<post_title>/add_comment', methods = ['POST'])
def commentOnPost(post_title="rando"):
    #Todo finish this - create blog comment and add it to the proper post
    form = CommentForm()
    if form.validate_on_submit():
        comment = BlogComment(name = "", date = "", score = 0, content = "", blog_id =, blog =)
    return render_template(blogPost(post_title))


@app.route('/blog/<post_title>')
@app.route('/blog/test', methods = ['GET', 'POST'])
def blogPost(post_title = "rando"):
    #do on or with title
    post_content = BlogPost.query.filter_by(id=post_title, published = True)
    blog_comments = BlogComment.query.filter_by(id=post_title)
    if post_content.count() == 0:
        return redirect(url_for('blog'))

    return render_template("sample_blog.html", post_content = post_content[0], blog_comments = blog_comments)

@app.route('/picupload', methods = ['GET', 'POST'])
def picUpload():
    print "Picture attempted to be uploaded"
    #should use secure file if uploader is not trusted. For personal use this
    file = request.files['pic']
    basedir = os.path.abspath(os.path.dirname(__file__))
    savedir = os.path.join(basedir, 'static/images/blog', file.filename)
    file.save(savedir)
    return jsonify(success = True)

@app.route('/gameoflife', methods = ['GET', 'POST'])
@app.route('/projects/gameoflife', methods = ['GET', 'POST'])
def gameOfLifeApp():
    return render_template("gameoflife.html")

@app.route('/projects/splinky')
def splinky():
    return render_template("splinky.html")

@app.route('/projects/satvocab')
def satVocab():
    return render_template("satvocab.html")

@app.route('/blog', methods = ['GET', 'POST'])
def blog():
    published_blogs = BlogPost.query.filter_by(published=True)
    return render_template("blogthree.html", published_blogs = published_blogs)

@app.route('/projects', methods = ['GET', 'POST'])
def projects():
    return render_template("projects.html")

@app.route('/about/', methods = ['GET', 'POST'])
def about():
    return render_template("about.html")

@app.route('/writing/', methods = ['GET', 'POST'])
def writing():
    return render_template("writing.html")

@app.route('/writing/acceleration', methods = ['GET', 'POST'])
def writing():
    return render_template("writing.html")

@app.route('/getAccelerationText', methods = ['GET'])
def getAccelerationText():
    basedir = os.path.abspath(os.path.dirname(__file__))
    filename = os.path.join(basedir, 'static/text/AccelerationPlainText.txt')
    content = open(filename, 'r').read()
    return jsonify(text=content)

@app.route('/admin/save', methods = ['GET', 'POST'])
@login_required
def savePost():
    for v in request.values:
        print v
    return redirect(url_for('adminBlogEdit'))


@app.route('/admin/<post_id>', methods = ['GET', 'POST'])
@app.route('/admin', methods = ['GET', 'POST'])
@login_required
def adminBlogEdit(post_id = 1):
    #logout_user()
    published_blogs = BlogPost.query.filter_by(published=True)
    unpublished_blogs = BlogPost.query.filter_by(published=False)
    blog = BlogPost.query.get(post_id)
    form = BlogForm()
    #print(request.args.get('value'))
    #print("what!")
    if form.validate_on_submit():
        #continue editing hereself.
       #b = BlogPost(blogTitle = form.title.data, date= datetime.now(), content=form.content.data, preview=form.preview.data, published=form.published.data, views=0, previewImage="../static/images/seattle.jpg" )
       #db.session.add(b)
       blog.blogTitle = form.title.data
       blog.blogContet = form.content.data
       blog.preview = form.preview.data
       blog.published = form.published.data
       db.session.add(blog)
       db.session.commit()
       print "I just updated something!"
    else:
        print "Form failed validation"
    return render_template("admin.html", published_blogs = published_blogs, unpublished_blogs = unpublished_blogs, current_blog = blog, form = form)

@app.route('/adminlogin', methods = ['GET', 'POST'])
def login():
    #already logged in redirect to adminPanel
    if g.user is not None and g.user.is_authenticated():
        return redirect(url_for('adminBlogEdit'))
    form = LoginForm()
    if form.validate_on_submit():
        #session['remember_me'] = form.remember_me.data
        username = form.username.data
        password = form.password.data
        print username
        admin = Admin.query.filter_by(name=username).first()
        if admin == None:
            print ("no admin found")
        else:
            if admin.check_password(password):
                login_user(admin)
                return redirect(url_for('adminBlogEdit'))

        #print ad
       # print(ad.check_password(form.password.data))
        return redirect(url_for('login'))
    return render_template('admin_login.html',
        form = form)

@app.route('/getProjectPreview', methods = ['GET'])
def getProjectPrevew():
    basedir = os.path.abspath(os.path.dirname(__file__))
    filename = os.path.join(basedir, 'templates/project_preview.html');
    content = open(filename, 'r').read()
    return jsonify(html=content)

@app.route('/getBlogPreview', methods = ['GET'])
def getBlogPrevew():
    basedir = os.path.abspath(os.path.dirname(__file__))
    filename = os.path.join(basedir, 'templates/blog_preview.html');
    content = open(filename, 'r').read()
    published_blogs = BlogPost.query.filter_by(published=True)
    #see what this returns
    rhtml =render_template("blog_preview.html", published_blog=published_blogs)
    #how to dynamically grab blog posts?
    print ("this should be html")
    return jsonify(html=rhtml)

@app.route('/getContactPreview', methods = ['GET'])
def getContactPrevew():
    basedir = os.path.abspath(os.path.dirname(__file__))
    filename = os.path.join(basedir, 'templates/contact_preview.html');
    content = open(filename, 'r').read()
    return jsonify(html=content)

@app.route('/getWritingPreview', methods = ['GET'])
def getWritingPrevew():
    basedir = os.path.abspath(os.path.dirname(__file__))
    filename = os.path.join(basedir, 'templates/writing_preview.html');
    content = open(filename, 'r').read()
    return jsonify(html=content)

