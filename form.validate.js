/**
 * Created by lemanzhang on 2/4/2015.
 */
define(function(require, exports, module){
    exports.predefinedRules = {
        email: '^[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$',
        china: {
            id: '^\d{15}$)|(^\d{17}([0-9]|X)$',
            mobile: '^(1)\d{10}$',
            zipcode: '^[1-9]{1}(\d+){5}$',
            telphone: '^\d{3,4}-\d{7,8}(-\d{1,5})?$'
        }
    };

    exports.getFieldsFromValidateConfig = function(validateConfig, fieldName){
        var config = {
            rules: {}
        };
        if(typeof validateConfig != 'undefined' &&
            typeof validateConfig.rules != 'undefined' &&
            typeof validateConfig.rules[fieldName] != 'undefined' &&
            typeof fieldName != 'undefined'){
            config['rules'] = {};
            config['rules'][fieldName] = validateConfig.rules[fieldName];
            if(typeof validateConfig.messages != 'undefined' &&
                typeof validateConfig.messages[fieldName] != 'undefined'){
                config['messages'] = {};
                config['messages'][fieldName] = validateConfig.messages[fieldName];
            }
            if(typeof validateConfig.success == 'function'){
                config.success = validateConfig.success;
            }
            if(typeof validateConfig.fail == 'function'){
                config.fail = validateConfig.fail;
            }
            if(typeof validateConfig.customValidate == 'function'){
                config.customValidate = validateConfig.customValidate();
            }
        }
        return config;
    };
});

(function(){
    var common = {
        isInteger: function(value){
            return parseInt(value)==value;
        }
    };

    var mod = {
        validate: function(form, obj, callback){
            if(typeof obj == 'undefined' ||
                typeof obj.rules == 'undefined'){
                throw "function of form.validate cannot be called with undefined parameter.\nobj or obj.rules cannot be undefined."
                return;
            }


            var rules = obj.rules;
            var messages = obj.messages;
            var result = {};

            $(rules).each(function(index, element) {
                // 检查rules中对应的字段
                // property即对应指定表单元素的name
                for(var property in element)
                {
                    // 查找可以输入文字的对象，排除checkbox和radio
                    var input = $('input[type!="checkbox"][type!="radio"][name="'+property+'"],textarea[name="'+property+'"]', form);
                    if(input.length > 0){

                        var allowEmpty = true;
                        // 检查必填项
                        if(typeof element[property].required == 'boolean' &&
                            element[property].required &&
                            input.val().length == 0)
                        {
                            allowEmpty = false;
                            var errorMessage = 'unspecified error message.';
                            if(typeof messages == 'object' &&
                                typeof messages[property] == 'object' &&
                                typeof messages[property].required == 'string')
                            {
                                errorMessage = messages[property].required;
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
                            if(typeof messages == 'object' &&
                                typeof messages[property] == 'object' &&
                                typeof messages[property].maxlength == 'string')
                            {
                                errorMessage = messages[property].maxlength;
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
                            if(typeof messages == 'object' &&
                                typeof messages[property] == 'object' &&
                                typeof messages[property].minlength == 'string')
                            {
                                errorMessage = messages[property].minlength;
                            }
                            if(typeof result[property] == 'undefined')
                            {
                                result[property] = {};
                            }
                            result[property].minlength = errorMessage;
                        }
                        // 检查自定义正则表达式字符(注意，如果该字段未设置required或者required值为false，则允许跳过正则表达式检测)
                        if(typeof element[property].customExpression == 'string' &&
                            !allowEmpty &&
                            !new RegExp(element[property].customExpression, "g").test(input.val()))
                        {
                            var errorMessage = 'unspecified error message.';
                            if(typeof messages == 'object' &&
                                typeof messages[property] == 'object' &&
                                typeof messages[property].customExpression == 'string')
                            {
                                errorMessage = messages[property].customExpression;
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
                            if(typeof messages == 'object' &&
                                typeof messages[property] == 'object' &&
                                typeof messages[property].required == 'string')
                            {
                                errorMessage = messages[property].required;
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
                            if(typeof messages == 'object' &&
                                typeof messages[property] == 'object' &&
                                typeof messages[property].maxlength == 'string')
                            {
                                errorMessage = messages[property].maxlength;
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
                            if(typeof messages == 'object' &&
                                typeof messages[property] == 'object' &&
                                typeof messages[property].minlength == 'string')
                            {
                                errorMessage = messages[property].minlength;
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
                            if(typeof messages == 'object' &&
                                typeof messages[property] == 'object' &&
                                typeof messages[property].customExpression == 'string')
                            {
                                errorMessage = messages[property].customExpression;
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
                            if(typeof messages == 'object' &&
                                typeof messages[property] == 'object' &&
                                typeof messages[property].required == 'string')
                            {
                                errorMessage = messages[property].required;
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
                            if(typeof messages == 'object' &&
                                typeof messages[property] == 'object' &&
                                typeof messages[property].maxindex == 'string')
                            {
                                errorMessage = messages[property].maxindex;
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
                            if(typeof messages == 'object' &&
                                typeof messages[property] == 'object' &&
                                typeof messages[property].minindex == 'string')
                            {
                                errorMessage = messages[property].minindex;
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
                            if(typeof messages == 'object' &&
                                typeof messages[property] == 'object' &&
                                typeof messages[property].customExpression == 'string')
                            {
                                errorMessage = messages[property].customExpression;
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
                            if(typeof messages == 'object' &&
                                typeof messages[property] == 'object' &&
                                typeof messages[property].maxindex == 'string')
                            {
                                errorMessage = messages[property].maxindex;
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
                            if(typeof messages == 'object' &&
                                typeof messages[property] == 'object' &&
                                typeof messages[property].minindex == 'string')
                            {
                                errorMessage = messages[property].minindex;
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
                            if(typeof messages == 'object' &&
                                typeof messages[property] == 'object' &&
                                typeof messages[property].customExpression == 'string')
                            {
                                errorMessage = messages[property].customExpression;
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

            var data = {};
            if(typeof obj.success == 'function' ||
                typeof obj.customValidate == 'function'){
                $('input,textarea,select', form).each(function(index, element){
                    var key = $(element).attr('name');
                    if(typeof key != 'string' || key.length == 0)
                        return;

                    data[key] = $(element).val();
                });
            }

            var customValidateResult = true;
            // 执行自定义校验
            if(typeof obj.customValidate == 'function'){
                customValidateResult = obj.customValidate(data);
                if(typeof customValidateResult != 'boolean'){
                    customValidateResult = true;
                }
            }

            // 如果通过校验，执行success并返回表单数据对象
            // 如果未通过校验，执行fail并返回错误message
            if(Object.getOwnPropertyNames(result).length > 0 &&
                customValidateResult) {
                if(typeof obj.fail == 'function'){
                    obj.fail(result);
                }
            }else{
                if(typeof obj.success == 'function'){
                    obj.success(data);
                    return true;
                }
            }

            // 实现jQuery回调
            if(typeof callback == 'function'){
                callback(result);
            }
            return false;
        }
    };

    $.fn.extend({
        validate: function(obj, callback){
            mod.validate(this, obj, callback);
        }
    });
})();