<template>
  <div>
    <Header></Header>
    <div class="regist">
      <el-input placeholder="请输入账号" v-model="username" clearable class="username"></el-input>
      <el-input
        placeholder="请输入密码"
        v-model="password"
        show-password
        class="username"
        autocomplete="off"
        name="pwd"
      ></el-input>
      <el-button class="login-btn" @click="regist">注册</el-button>
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
    regist() {
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
          .post("/api/setUser", {
            username: this.username,
            password: this.$md5(this.password)
          })
          .then(response => {
            if (response.data.status == true) {
              this.$message({
                message: "注册成功",
                type: "success"
              });
              this.$router.push({
                path: "/login" //跳转的路径
              });
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
};
</script>
<style scoped>
.regist {
  max-width: 470px;
  margin: 100px auto 15px;
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
  margin-top: 20px;
  color: #fff;
  border: none;
  background-color: #42b983;
  width: 350px;
}
</style>
