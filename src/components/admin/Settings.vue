<template>
  <section class="blog-body">
    <el-table
      :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%"
    >
      <!-- <el-table-column label="Date" prop="post_time|formatDate('yyyy-MM-dd')"></el-table-column> -->
      <el-table-column label="Title" prop="title"></el-table-column>
      <el-table-column align="right">
        <!-- <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
        </template>-->
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      search: "",
      username: ""
    };
  },
  methods: {
    handleEdit(index, row) {
      this.$router.push({ path: "/admin/update", query: { draft: row } });
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .post("/api/admin/delArticle", {
              id: row.id
            })
            .then(response => {
              if (response.data.status == true) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.tableData.splice(index, 1);
              } else if (response.data.status == false) {
                this.$message.error("删除失败");
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(r => {
          console.log(r);
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  mounted() {
    this.username = sessionStorage.getItem("username");
    this.axios
      .get("/api/getArticle", { params: { state: 1, username: this.username } })
      .then(response => {
        this.tableData = response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>