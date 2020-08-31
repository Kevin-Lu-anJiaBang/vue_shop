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
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="modifyCate(scope.row)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row)">删除</el-button>
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
      width="50%"
      @close="addCateDialogClosed">
      <!-- 内容主体区 -->
      <div>
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChanged" clearable change-on-select></el-cascader>
          </el-form-item>
        </el-form>
      </div>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClosed">
      <!-- 内容主体区 -->
      <div>
        <el-form :model="editCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editCateForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
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
      editCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0 ,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0

      },
      //添加分类表单的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ]
      },
      // 父级分类列表
      parentCateList: [],
      cascaderProps: { expandTrigger: 'hover',  value: 'cat_id', label: 'cat_name', children: 'children',},
      selectedKeys: [],
      editCateForm: {
        cat_name: '',
        cat_id: ''
      }
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
      // 先获取父级分类的数据列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const {data: res} = await this.$http.get('categories', {params: {type: 2}})
      if(res.meta.status != 200) return this.$message.error('获取数据失败')
      // console.log(res.data)
      this.parentCateList = res.data
    },
    // 级联选择数据发生变化
    parentCateChanged() {
      // console.log(this.selectedKeys)
      // 如果selectedKeys数组长度大于0，证明选中了父级分类
      // 反之，说明没有选中任何父级分类
      if(this.selectedKeys.length > 0 ) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }
      else {
         this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate() {
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async valid => {
        if(!valid) return 
        // console.log(this.addCateForm)
        const {data: res} = await this.$http.post('categories', this.addCateForm)
        if(res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    editCateDialogClosed() {

    },
    // 删除分类信息
    async deleteCate(info) {
      const confirmRes = await this.$confirm('此操作将永久删除该分类，是否继续？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if(confirmRes == 'cancel') return this.$message.info('已取消删除!')
      const {data: res} = await this.$http.delete('categories/'+info.cat_id)
      // console.log(res)
      if(res.meta.status != 200) return this.$message.error('删除失败！')
      this.$message.success('删除成功！')
      this.getCateList()
    },
    // 修改分类信息
    async modifyCate(info) {
      this.editCateDialogVisible = true
      this.editCateForm.cat_name = info.cat_name
      this.editCateForm.cat_id = info.cat_id
    },
    editCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if(!valid) return
        const {data: res} = await this.$http.put('categories/' + this.editCateForm.cat_id, {cat_name: this.editCateForm.cat_name})
        // console.log(res)
        if(res.meta.status != 200) this.$message.error('编辑失败！')
        this.$message.success('编辑成功！')
        this.editCateDialogVisible = false
        this.getCateList()
      })
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
.el-cascader{width: 100%;}
</style>