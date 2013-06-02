from flask.ext.wtf import Form, TextField, BooleanField, TextAreaField
from flask.ext.wtf import Required, Length, SelectField

class LoginForm(Form):
    username = TextField('username')#email = TextField('post', validators = [Required()])
    password = TextField('password')

class BlogForm(Form):
   title = TextField('title')
   content = TextAreaField('content', default = "please add content")
   preview = TextAreaField('preview')
   published = BooleanField(False)




