<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="90px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status == '0'" type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="70px"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">{{ scope.row.create_time | dateFormat }}</template>
        </el-table-column>
        <el-table-column prop label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button type="success" size="mini" icon="el-icon-location" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 对话框 -->
    <el-dialog
  title="修改地址"
  :visible.sync="addDialogVisible"
  width="50%"
  @close="addressDialogClosed">
  <el-form :model="addressForm" :rules="addressRules" ref="addressRef" label-width="100px">
  <el-form-item label="省市区/县" prop="address1">
  <el-cascader :options="cityData" :props="cityOption" v-model="addressForm.address1"></el-cascader>
  </el-form-item>
  <el-form-item label="详细地址" prop="address2">
    <el-input v-model="addressForm.address2"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
<!-- 物流进度 -->
<el-dialog
  title="物流进度"
  :visible.sync="progressVisible"
  width="50%">
 <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
</el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  name: "",
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      goodsList: [],
      addDialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur'}
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur'}
        ]
      },
      cityData,
      cityOption: {
        value: 'code',
        label: 'name',
        children: 'sub'
      },
      progressVisible: false,
      progressInfo: []
    };
  },

  components: {},
  computed: {},
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      // console.log(res);
      if (res.meta.status != 200)
        return this.$message.error("获取订单列表失败！");
      this.total = res.data.total;
      this.goodsList = res.data.goods;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getOrderList();
    },
    showBox() {
      this.addDialogVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressRef.resetFields()
    },
    async showProgressBox() {
      const {data: res} = await this.$http.get('/kuaidi/1106975712662')
      if(res.meta.status !=200) return this.$message.error('获取数据失败')
      this.progressInfo = res.data
      // console.log(this.progressInfo)
      this.progressVisible = true
    }
  },
  created() {
    this.getOrderList();
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.el-pagination{margin-top: 15px;}
</style>