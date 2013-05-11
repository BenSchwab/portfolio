from flask import Blueprint, request, redirect, render_template, url_for
from flask.views import MethodView
from flask import jsonify
from app import app
from app.models import Post, Comment
from flask.ext.mongoengine.wtf import model_form
import os

posts = Blueprint('posts', __name__, template_folder='templates')


@app.route('/', methods = ['GET', 'POST'])
@app.route('/index', methods = ['GET', 'POST'])
def index():
    return render_template("main.html")


@app.route('/blog', methods = ['GET', 'POST'])
def blog():
    return render_template("blogthree.html")

@app.route('/getAccelerationText', methods = ['GET'])
def getAccelerationText():
    basedir = os.path.abspath(os.path.dirname(__file__))
    filename = os.path.join(basedir, 'static/text/AccelerationPlainText.txt')
    content = open(filename, 'r').read()
    return jsonify(text=content)

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
    return jsonify(html=content)

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

class ListView(MethodView):

    def get(self):
        posts = Post.objects.all()
        return render_template('posts/list.html', posts=posts)


class DetailView(MethodView):

    form = model_form(Comment, exclude=['created_at'])

    def get_context(self, slug):
        post = Post.objects.get_or_404(slug=slug)
        form = self.form(request.form)

        context = {
            "post": post,
            "form": form
        }
        return context

    def get(self, slug):
        context = self.get_context(slug)
        return render_template('posts/detail.html', **context)

    def post(self, slug):
        context = self.get_context(slug)
        form = context.get('form')

        if form.validate():
            comment = Comment()
            form.populate_obj(comment)

            post = context.get('post')
            post.comments.append(comment)
            post.save()

            return redirect(url_for('posts.detail', slug=slug))

        return render_template('posts/detail.html', **context)


# Register the urls
#posts.add_url_rule('/', view_func=ListView.as_view('list'))
posts.add_url_rule('/<slug>/', view_func=DetailView.as_view('detail'))