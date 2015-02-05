/**
 * Created by Kaidong on 2/4/2015.
 */
define(function(require, exports, module){
    var $ = require('jquery');
    var common = {
        isInteger: function(value){
            return parseInt(value)==value;
        }
    };

    var mod = {
        validate: function(form, obj, callback){
            if(typeof obj == 'undefined' ||
                typeof obj.rules == 'undefined')
                return;

            var rules = obj.rules;
            var message = obj.message;
            var result = {};

            $(rules).each(function(index, element) {
                // 检查rules中对应的字段
                // property即对应指定表单元素的name
                for(var property in element)
                {
                    // 查找可以输入文字的对象，排除checkbox和radio
                    var input = $('input[type!="checkbox"][type!="radio"][name="'+property+'"],textarea[name="'+property+'"]', form);
                    if(input.length > 0){
                        // 检查必填项
                        if(typeof element[property].required == 'boolean' &&
                            element[property].required &&
                            input.val().length == 0)
                        {
                            var errorMessage = 'unspecified error message.';
                            if(typeof message == 'object' &&
                                typeof message[property] == 'object' &&
                                typeof message[property].required == 'string')
                            {
                                errorMessage = message[property].required;
                            }
                            if(typeof result[property] == 'undefined')
                            {
                                result[property] = {};
                            }
                            result[property].required = errorMessage;
                        }
                        // 检查字符最大长度
                        if(typeof element[property].maxlength == 'number' &&
                            element[property].maxlength > 0 &&
                            common.isInteger(element[property].maxlength) &&
                            input.val().length > element[property].maxlength)
                        {
                            var errorMessage = 'unspecified error message.';
                            if(typeof message == 'object' &&
                                typeof message[property] == 'object' &&
                                typeof message[property].maxlength == 'string')
                            {
                                errorMessage = message[property].maxlength;
                            }
                            if(typeof result[property] == 'undefined')
                            {
                                result[property] = {};
                            }
                            result[property].maxlength = errorMessage;
                        }
                        // 检查字符最小长度
                        if(typeof element[property].minlength == 'number' &&
                            element[property].minlength > 0 &&
                            common.isInteger(element[property].minlength) &&
                            input.val().length < element[property].minlength)
                        {
                            var errorMessage = 'unspecified error message.';
                            if(typeof message == 'object' &&
                                typeof message[property] == 'object' &&
                                typeof message[property].minlength == 'string')
                            {
                                errorMessage = message[property].minlength;
                            }
                            if(typeof result[property] == 'undefined')
                            {
                                result[property] = {};
                            }
                            result[property].minlength = errorMessage;
                        }
                        // 检查自定义正则表达式字符
                        if(typeof element[property].customExpression == 'string' &&
                            !new RegExp(element[property].customExpression, "g").test(input.val()))
                        {
                            var errorMessage = 'unspecified error message.';
                            if(typeof message == 'object' &&
                                typeof message[property] == 'object' &&
                                typeof message[property].customExpression == 'string')
                            {
                                errorMessage = message[property].customExpression;
                            }
                            if(typeof result[property] == 'undefined')
                            {
                                result[property] = {};
                            }
                            result[property].customExpression = errorMessage;
                        }
                    }
                    // 查找复选框的选择情况
                    var check = $('input[type="checkbox"][name="'+property+'"]', form);
                    if(check.length > 0){
                        var checkedLength = 0;
                        check.each(function(index, element){
                            checkedLength += $(element).is(':checked')?1:0;
                        });
                        // 检查必填项
                        if(typeof element[property].required == 'boolean' &&
                            element[property].required &&
                            checkedLength == 0)
                        {
                            var errorMessage = 'unspecified error message.';
                            if(typeof message == 'object' &&
                                typeof message[property] == 'object' &&
                                typeof message[property].required == 'string')
                            {
                                errorMessage = message[property].required;
                            }
                            if(typeof result[property] == 'undefined')
                            {
                                result[property] = {};
                            }
                            result[property].required = errorMessage;
                        }
                        // 检查字符最大长度
                        if(typeof element[property].maxlength == 'number' &&
                            element[property].maxlength > 0 &&
                            common.isInteger(element[property].maxlength) &&
                            checkedLength > element[property].maxlength)
                        {
                            var errorMessage = 'unspecified error message.';
                            if(typeof message == 'object' &&
                                typeof message[property] == 'object' &&
                                typeof message[property].maxlength == 'string')
                            {
                                errorMessage = message[property].maxlength;
                            }
                            if(typeof result[property] == 'undefined')
                            {
                                result[property] = {};
                            }
                            result[property].maxlength = errorMessage;
                        }
                        // 检查字符最小长度
                        if(typeof element[property].minlength == 'number' &&
                            element[property].minlength > 0 &&
                            common.isInteger(element[property].minlength) &&
                            checkedLength < element[property].minlength)
                        {
                            var errorMessage = 'unspecified error message.';
                            if(typeof message == 'object' &&
                                typeof message[property] == 'object' &&
                                typeof message[property].minlength == 'string')
                            {
                                errorMessage = message[property].minlength;
                            }
                            if(typeof result[property] == 'undefined')
                            {
                                result[property] = {};
                            }
                            result[property].minlength = errorMessage;
                        }
                        // 检查自定义正则表达式字符
                        if(typeof element[property].customExpression == 'string' &&
                            !new RegExp(element[property].customExpression, "g").test(check.val()))
                        {
                            var errorMessage = 'unspecified error message.';
                            if(typeof message == 'object' &&
                                typeof message[property] == 'object' &&
                                typeof message[property].customExpression == 'string')
                            {
                                errorMessage = message[property].customExpression;
                            }
                            if(typeof result[property] == 'undefined')
                            {
                                result[property] = {};
                            }
                            result[property].customExpression = errorMessage;
                        }
                    }
                    // 查找单选框的选择情况
                    var radio = $('input[type="radio"][name="'+property+'"]', form);
                    if(radio.length > 0){
                        var radioSelectedIndex = -1;
                        var i = 0;
                        radio.each(function(index, element){
                            if($(element).is(':checked')){
                                radioSelectedIndex = i;
                            }
                            i++;
                        });
                        // 检查必填项
                        if(typeof element[property].required == 'boolean' &&
                            element[property].required &&
                            radioSelectedIndex == -1)
                        {
                            var errorMessage = 'unspecified error message.';
                            if(typeof message == 'object' &&
                                typeof message[property] == 'object' &&
                                typeof message[property].required == 'string')
                            {
                                errorMessage = message[property].required;
                            }
                            if(typeof result[property] == 'undefined')
                            {
                                result[property] = {};
                            }
                            result[property].required = errorMessage;
                        }
                        // 检查下标的位置最小值
                        if(typeof element[property].maxindex == 'number' &&
                            element[property].maxindex > 0 &&
                            common.isInteger(element[property].maxindex) &&
                            radioSelectedIndex > element[property].maxindex)
                        {
                            var errorMessage = 'unspecified error message.';
                            if(typeof message == 'object' &&
                                typeof message[property] == 'object' &&
                                typeof message[property].maxindex == 'string')
                            {
                                errorMessage = message[property].maxindex;
                            }
                            if(typeof result[property] == 'undefined')
                            {
                                result[property] = {};
                            }
                            result[property].maxindex = errorMessage;
                        }
                        // 检查下标的位置最大值
                        if(typeof element[property].minindex == 'number' &&
                            element[property].minindex > 0 &&
                            common.isInteger(element[property].minindex) &&
                            radioSelectedIndex < element[property].minindex)
                        {
                            var errorMessage = 'unspecified error message.';
                            if(typeof message == 'object' &&
                                typeof message[property] == 'object' &&
                                typeof message[property].minindex == 'string')
                            {
                                errorMessage = message[property].minindex;
                            }
                            if(typeof result[property] == 'undefined')
                            {
                                result[property] = {};
                            }
                            result[property].minindex = errorMessage;
                        }
                        // 检查自定义正则表达式字符
                        if(typeof element[property].customExpression == 'string' &&
                            !new RegExp(element[property].customExpression, "g").test(radio.val()))
                        {
                            var errorMessage = 'unspecified error message.';
                            if(typeof message == 'object' &&
                                typeof message[property] == 'object' &&
                                typeof message[property].customExpression == 'string')
                            {
                                errorMessage = message[property].customExpression;
                            }
                            if(typeof result[property] == 'undefined')
                            {
                                result[property] = {};
                            }
                            result[property].customExpression = errorMessage;
                        }
                    }
                    // 查找下拉列表
                    var select = $('select[name="'+property+'"]', form);
                    if(select.length > 0) {
                        var selectedIndex = select[0].selectedIndex;
                        // 检查下标的位置最小值
                        if(typeof element[property].maxindex == 'number' &&
                            element[property].maxindex > 0 &&
                            common.isInteger(element[property].maxindex) &&
                            selectedIndex > element[property].maxindex)
                        {
                            var errorMessage = 'unspecified error message.';
                            if(typeof message == 'object' &&
                                typeof message[property] == 'object' &&
                                typeof message[property].maxindex == 'string')
                            {
                                errorMessage = message[property].maxindex;
                            }
                            if(typeof result[property] == 'undefined')
                            {
                                result[property] = {};
                            }
                            result[property].maxindex = errorMessage;
                        }
                        // 检查下标的位置最大值
                        if(typeof element[property].minindex == 'number' &&
                            element[property].minindex > 0 &&
                            common.isInteger(element[property].minindex) &&
                            selectedIndex < element[property].minindex)
                        {
                            var errorMessage = 'unspecified error message.';
                            if(typeof message == 'object' &&
                                typeof message[property] == 'object' &&
                                typeof message[property].minindex == 'string')
                            {
                                errorMessage = message[property].minindex;
                            }
                            if(typeof result[property] == 'undefined')
                            {
                                result[property] = {};
                            }
                            result[property].minindex = errorMessage;
                        }
                        // 检查自定义正则表达式字符
                        if(typeof element[property].customExpression == 'string' &&
                            !new RegExp(element[property].customExpression, "g").test(select.val()))
                        {
                            var errorMessage = 'unspecified error message.';
                            if(typeof message == 'object' &&
                                typeof message[property] == 'object' &&
                                typeof message[property].customExpression == 'string')
                            {
                                errorMessage = message[property].customExpression;
                            }
                            if(typeof result[property] == 'undefined')
                            {
                                result[property] = {};
                            }
                            result[property].customExpression = errorMessage;
                        }
                    }
                }
            });

            // 如果通过校验，执行success并返回表单数据对象
            // 如果未通过校验，执行fail并返回错误message
            if(Object.getOwnPropertyNames(result).length > 0) {
                if(typeof obj.fail == 'function'){
                    obj.fail(result);
                }
            }else{
                if(typeof obj.success == 'function'){
                    var data = {};
                    $('input,textarea,select', form).each(function(index, element){
                        var key = $(element).attr('name');
                        if(typeof key != 'string' || key.length == 0)
                            return;

                        data[key] = $(element).val();
                    });
                    obj.success(data);
                }
            }

            // 实现jQuery回调
            if(typeof callback == 'function'){
                callback(result);
            }
        }
    };

    exports.predefinedRules = {
        email: '^[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$',
        china: {
            id: '^\d{15}$)|(^\d{17}([0-9]|X)$',
            mobile: '^(1)\d{10}$',
            zipcode: '[1-9]{1}(\d+){5}'
        }
    };

    $.fn.extend({
        validate: function(obj, callback){
            mod.validate(this, obj, callback);
        }
    });
});
