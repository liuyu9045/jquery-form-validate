# jQuery表单验证组件

------

**jquery-form-validate**是在电台管理端开发过程中，对比了[jQuery Validate Plugin](http://jqueryvalidation.org/)的一些设计思想写的一个简化版表单验证组件。相对于jQuery Validate Plugin压缩后21kb的大小，jquery-form-validate在使用UglifyJS压缩后仅约7kb。

您可以使用jquery-form-validate轻松配置表单的验证规则，它是一个非常简单的json结构，可以方便地在JavaScript中对验证规则进行操作。

------

## 如何使用jquery-form-validate

第一步，您需要在相关页面中引入项目中的form.validate.min.js文件。
```
...
<script src="form.vlidate.min.js" type="text/javascript"><script>
...
<form action="/register" method="POST" id="register-form">
    <input type="text" name="username" />
    <input type="text" name="age" />
    <input type="text" name="mobilephone" />
    <input type="text" name="tel" />
    <input type="submit" value="submit">
</form>
```
然后，您需要定义一个json对象作为验证表单的规则：
```
var validateRule = {
    rules: {
        name: {
            required: true,
            maxlength: 16
        },
        age: {
            required: true,
            customExpression: "^[1-9]/d{0,2}$"
        }
    },
    messages: {
        name: {
            required: "username cannot be empty.",
            maxlength: "you can only type 16 characters for username."
        },
        age: {
            required: "age cannot be empty",
            customExpression: "the age you typed is illegal."
        }
    },
    customValidate: function(data){
        if(data.mobilephone.length != 0 || data.tel.length != 0)
            return true;
        else
            return false;
    },
    success: function(data){
        $.post('/register', data);
    },
    fail: function(result){
        var msgStr = [];
        for(name in result) {
            for(msg in result[name]){
                msgStr.push(result[name][msg])
            }
        }
        console.log(msgStr.join(' '));
    }
};
```

有了上面的规则对象，只需要在适当的地方调用form的validate方法，就可以完成表单的验证操作：
```
$('#register-form').validate(validateRule);
```

初看这个对象，可能会有些头晕，让我们一个个来看看它：

### 1.rule属性
在定义的规则对象中，rules属性是必填的。如果规则对象中缺少了rules属性，或名称不正确，