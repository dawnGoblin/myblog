<template>
  <div>
    <Header></Header>
    <div class="login">
      <el-input placeholder="请输入账号" v-model="username" clearable class="username"></el-input>
      <el-input
        placeholder="请输入密码"
        v-model="password"
        show-password
        class="username"
        autocomplete="off"
        @keyup.enter.native="login"
      ></el-input>
      <el-button class="login-btn" @click="login">登录</el-button>
      <p>
        还没有账号？请
        <el-button type="text">
          <router-link to="/regist">注册</router-link>
        </el-button>
      </p>
    </div>
    <Footer></Footer>
  </div>
</template>
<script>
import Header from "./Header.vue";
import Footer from "./Footer.vue";
export default {
  components: { Header, Footer },
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    login() {
      if (this.username == "") {
        this.$message({
          message: "账号不能为空",
          type: "warning"
        });
      } else if (this.password == "") {
        this.$message({
          message: "密码不能为空",
          type: "warning"
        });
      } else {
        this.axios
          .post("/api/userLogin", {
            username: this.username,
            password: this.$md5(this.password)
          })
          .then(response => {
            if (response.data.status == true) {
              this.$message({
                message: "登录成功",
                type: "success"
              });
              sessionStorage.setItem("username", this.username);
              sessionStorage.setItem("token",response.data.token);
              this.$router.push({
                path: "/admin/newEssay" //跳转的路径
              });
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch(error => {
            this.$message.error("服务器错误");
            console.log(error);
          });
      }
    }
  }
};
</script>
<style scoped>
.login {
  max-width: 470px;
  margin: 100px auto 5px;
  position: relative;
  padding-left: 15px;
  padding-right: 15px;
  text-align: center;
}
.username {
  margin: 10px 0;
  width: 350px;
}
.login-btn {
  margin-top: 30px;
  color: #fff;
  border: none;
  background-color: #42b983;
  width: 350px;
}
a {
  color: #42b983;
}
</style>
