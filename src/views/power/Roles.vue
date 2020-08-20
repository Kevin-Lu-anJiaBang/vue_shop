<template>
  <div class>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showDialog('addRoleDialogVisible')">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table border stripe :data="roleList">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i1 == 0 ? 'bdtop': '','vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 第一列给一级权限使用 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 给二级和三级权限使用 -->
              <el-col :span="19">
                <!-- 通过for循环 嵌套二级权限 -->
                <el-row :class="[ i2 == 0 ? '' : 'bdtop','vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18" >
                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editRole(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="RoleDialogClose('addFormRef')">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="用户名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="用户描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      @close="RoleDialogClose('editFormRef')">
      <!-- 内容主体区 -->
      <el-form :model="editRoleInfo" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="用户名称">
          <el-input v-model="editRoleInfo.roleName" prop="roleName"></el-input>
        </el-form-item>
        <el-form-item label="用户描述" prop="roleDesc">
          <el-input v-model="editRoleInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%">
      <!-- 内容主体区 -->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRightDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      addForm: {
        roleName: '',
        roleDesc: '',
      },
      editForm: {
        roleName: '',
        roleDesc: '',
      },
      addFormRules: {
        roleName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入用户描述', trigger: 'blur' },
        ],
      },
      editFormRules: {
        roleName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入用户描述', trigger: 'blur' },
        ],
      },
      addRoleDialogVisible: false,
      editRoleDialogVisible: false,
      setRightDialogVisible: false,
      editRoleInfo:{
        roleDesc: '',
        roleName: ''
      },
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps:{
        label: 'authName',
        children: 'children'
      },
      // 默认选中
      defKeys: []
    };
  },
  components: {},
  computed: {},
  watch: {},
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200)
        return this.$message.error("获取列表数据失败");
      this.roleList = res.data;
      // console.log(res.data)
    },
    // 显示对话框按钮
    showDialog(DialogVisible) {
      this[DialogVisible] = true
    },
    //弹框关闭清空表单函数
    RoleDialogClose(refName) {
      this.$refs[refName].resetFields()
    },
    // 添加角色表单函数
    confirmAddRole() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return
        const {data: res} = await this.$http.post('roles', this.addForm)
        if( res.meta.status != 201 ) return this.$message.error(res.meta.msg)
        this.$message.success('角色添加成功！')
        this.addRoleDialogVisible = false
        this.getRolesList()
      })
    },
    // 根据id删除角色函数
    async deleteRole(id) {
      const deleteRes = await this.$confirm('此操作将永久删除该角色，是否继续？','提示',{
        confirmButtonTextL:'确定',cancelButtonText:'取消',type:'warning'
      }).catch(error => error)
      if(deleteRes == 'cancel') return this.$message.info('已取消删除！')
      const {data: res} = await this.$http.delete('roles/' + id)
      if(res.meta.status != 200) return this.$message.error('删除失败！')
      this.$message.success('删除成功！')
      this.getRolesList()
    },
    // 编辑角色函数
    async editRole(id) {
      const {data: res} = await this.$http.get('roles/' + id)
      if(res.meta.status != 200) return this.$message.error('获取信息失败！')
      this.editRoleInfo = res.data
      this.editRoleDialogVisible = true
    },
    // 提交编辑角色
    confirmEditRole() {
      this.$refs.editFormRef.validate(async valid => {
        if(!valid) return
        const {data: res} = await this.$http.put('roles/' + this.editRoleInfo.roleId, {roleName: this.editRoleInfo.roleName, roleDesc: this.editRoleInfo.roleDesc})
        if(res.meta.status != 200) return this.$message.error('编辑保存失败！')
        this.editRoleDialogVisible = false
        this.$message.success('编辑保存成功！')
        this.getRolesList()
      })
    },
    // 根据id删除对应的权限
    async removeRightById(role, rightId) {
      const deleteRes = await this.$confirm('此操作将永久删除该角色权限，是否继续？','提示',{
        confirmButtonTextL:'确定',cancelButtonText:'取消',type:'warning'
      }).catch(error => error)
      if( deleteRes == 'cancel' ) return this.$message.info('已取消！')
      const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if(res.meta.status != 200 ) return this.$message.error('删除失败')
      // this.getRolesList() 调用这个函数会发生页面的完整渲染
      // js 改变形参可以导致实参的改变
      role.children = res.data
    },
    async showSetRightDialog(role) {
      const {data: res} = await this.$http.get('rights/tree')
      if(res.meta.status != 200) return this.$message.error('获取数据失败')
      this.rightslist = res.data
      // console.log(this.rightslist)
      // 递归获取三级节点id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归形式，获取角色下三级权限id
    getLeafKeys(node, arr) {
      console.log(node)
      // 如果node不包含children属性，则是三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      // 递归调用自身
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    }
  },
  created() {
    this.getRolesList();
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.vcenter{display: flex;align-items: center;}
.el-tag{margin: 7px;}
.bdtop{border-top: 1px solid #eee;}
.bdbottom{border-bottom: 1px solid #eee;}
</style>