webpackJsonp([10],{hfmC:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var s={name:"tags",data:function(){return{Tags:[],inputVisible:!1,inputValue:""}},methods:{handleClose:function(t){var n=this;this.axios.post("/api/admin/delTag",{name:t}).then(function(e){n.Tags.splice(n.Tags.indexOf(t),1),n.$message({message:"删除成功",type:"success"})}).catch(function(t){console.log(t)})},showInput:function(){var t=this;this.inputVisible=!0,this.$nextTick(function(n){t.$refs.saveTagInput.$refs.input.focus()})},handleInputConfirm:function(){var t=this,n=this.inputValue;n.length<1?this.$message({message:"内容不能为空",type:"warning"}):this.axios.post("/api/admin/insertTag",{name:n}).then(function(e){t.$message({message:"添加成功",type:"success"}),n&&t.Tags.push(n),t.inputVisible=!1,t.inputValue=""}).catch(function(t){console.log(t)})}},mounted:function(){var t=this;this.axios.get("/api/admin/getTagAll").then(function(n){var e=n.data.map(function(t){return t.name});t.Tags=e}).catch(function(t){console.log(t)})}},a={render:function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("section",{staticClass:"blog-body"},[t._l(t.Tags,function(n,s){return e("el-tag",{key:s,attrs:{closable:"","disable-transitions":!1},on:{close:function(e){return t.handleClose(n)}}},[t._v(t._s(n))])}),t._v(" "),t.inputVisible?e("el-input",{ref:"saveTagInput",staticClass:"input-new-tag",attrs:{size:"small"},nativeOn:{keyup:function(n){return!n.type.indexOf("key")&&t._k(n.keyCode,"enter",13,n.key,"Enter")?null:t.handleInputConfirm(n)}},model:{value:t.inputValue,callback:function(n){t.inputValue=n},expression:"inputValue"}}):e("el-button",{staticClass:"button-new-tag",attrs:{size:"small"},on:{click:t.showInput}},[t._v("+ New Tag")])],2)},staticRenderFns:[]};var i=e("VU/8")(s,a,!1,function(t){e("htrK")},"data-v-23bc81a2",null);n.default=i.exports},htrK:function(t,n){}});
//# sourceMappingURL=10.88d7d5d70ede62cfb405.js.map