<template>
  <div class="">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
          <!-- 表格区 -->
          <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
            <template slot="isok" slot-scope="scope">
              <i v-if="scope.row.cat_deleted == false" class="el-icon-success" style="color:lightgreen;"></i>
              <i v-else class="el-icon-error" style="color:red;"></i>
            </template>
            <template slot="order" slot-scope="scope">
              <el-tag v-if="scope.row.cat_level == 0" type="primary" size="mini">一级</el-tag>
              <el-tag v-else-if="scope.row.cat_level == 1" type="success" size="mini">二级</el-tag>
              <el-tag v-else type="warning" size="mini">三级</el-tag>
            </template>
            <template slot="opt" slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </template>
          </tree-table>
          <!-- 分页区 -->
        </el-col>
      </el-row>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%">
      <!-- 内容主体区 -->
      <div>

        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
          </el-form-item>
        </el-form>
      </div>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
 name: "",
  data () {
    return {
      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表
      cateList: [],
      // 为table指定列的定义
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }
      ,{
        label: '是否有效',
        // 表示当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用模板名称
        template: 'isok'
      }
      ,{
        label: '排序',
        // 表示当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用模板名称
        template: 'order'
      },{
        label: '操作',
        // 表示当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用模板名称
        template: 'opt'
      }],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0 ,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 1

      },
      //添加分类表单的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ]
      },
      
    }
  },
  components: {},
  computed: {},
  watch: {},
  methods: {
    //获取商品分类的数据
    async getCateList() {
      const {data: res} = await this.$http.get('categories',{params : this.querInfo})
      if(res.meta.status != 200) return this.$message.error('获取商品数据失败！')
      // console.log(res)
      this.cateList = res.data
    },
    showAddCateDialog() {
      this.addCateDialogVisible = true
    }
  },
  created () {
    this.getCateList()
  },
  mounted () {
  },
}
</script>
<style lang="less" scoped>
.zk-table{margin-top: 15px;}
</style>