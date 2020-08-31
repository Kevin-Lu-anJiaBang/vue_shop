<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" show-icon :closable="false" type="warning"></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isButtonDisabled"
            @click="editDialogVisible = true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="cope">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isButtonDisabled"
            @click="editDialogVisible = true"
          >添加属性</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="cope">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="editDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区 -->
      <div>
        <el-form :model="editForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      // 商品分类列表
      cateList: [],
      cateProps: { expandTrigger: 'hover' ,value: 'cat_id', label: 'cat_name', children: 'children' },
      selectedCateKeys: [],
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      editDialogVisible: false,
      editForm:{
        attr_name:''
      },
      addFormRules: {
        attr_name:[
          {required:true, message:'请输入参数名称', trigger: 'blur'}
        ]
    }
    }
  },

  components: {},
  computed: {
    // 添加参数按钮控制
    isButtonDisabled() {
      if(this.selectedCateKeys.length != 3) return true
      return false
    },
    // 级联选择器所选型的id
    cateId() {
      if(this.selectedCateKeys.length == 3) return this.selectedCateKeys[2]
      return null
    },
    // 动态标题计算文本
    titleText() {
      if(this.activeName == 'many') return '动态参数'
      return '静态属性'
    }
  },
  methods: {
    async getCateList() {
      const {data: res} = await this.$http.get('categories')
      if(res.meta.status != 200) return this.$message.error('获取商品分类失败！')
      this.cateList = res.data
      // console.log(this.cateList)
    },
    // 获取参数的列表数据
    async getParamsData() {
      // 根据所选分类的id，当前所处面板获取对应的参数
      const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params: {sel: this.activeName}})
      if(res.meta.status != 200) return this.$message.error('获取参数列表失败！')
      // console.log(res.data)
      if(this.activeName == 'many') this.manyTableData = res.data
      else this.onlyTableData = res.data
    },
    handleChange() {
      if(this.selectedCateKeys.length != 3) {
        return this.selectedCateKeys = []
      }
      this.getParamsData()
    },
    // tab页签点击事件
    handleTabClick() {
      this.getParamsData()
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return
        const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`,{attr_sel:this.activeName, attr_name:this.editForm.attr_name})
        if(res.meta.status != 201) return this.$message.error('添加参数失败！')
        // console.log(res)
        this.$message.success('添加成功！')
        this.editDialogVisible = false
        this.getParamsData()
      })
    }
  },
  created() {
    this.getCateList()
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
</style>