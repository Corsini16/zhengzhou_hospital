<template>
    <div class="">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <el-button color="#13b9c9" @click="addMedicineBtn">添加文章</el-button>
                </div>
            </template>
            <!--文章列表表格 -->
            <el-table :data="medicineList.data" border style="width:100%" height="400" :header-cell-style="{
                backgroundColor: 'rgba(19, 185, 201, 0.7)',
                color: 'rgb(70, 69, 69)'
            }">
                <el-table-column type="index" width="50" />
                <el-table-column prop="title" label="药品名称" width="200" />
                <el-table-column prop="type" label="类型" width="100" />
                <el-table-column prop="sale_price" label="原价" width="100" />
                <el-table-column prop="market_price" label="活动价" width="100" />
                <el-table-column prop="company" label="生产厂家" width="260" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="primary" size="small" color="#13b9c9" :icon="Edit"
                            @click="update_(scope.row)">修改</el-button>
                        <el-button type="primary" size="small" color="#13b9c9" :icon="CreditCard"
                            @click="detail_(scope.row)">详情</el-button>

                        <el-popconfirm title="确定删除吗?" @confirm="delete_(scope.row)" cancel-button-type="info">
                            <template #reference>
                                <el-button type="primary" size="small" color="#13b9c9" :icon="Delete">删除</el-button>
                            </template>
                        </el-popconfirm>
                        <!--  -->
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[1, 2, 100, 200]"
                :small="small" :disabled="disabled" :background="background"
                layout="total, sizes, prev, pager, next, jumper" :total="medicineList.data.length"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />

        </el-card>

        <!-- 对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="50%" :before-close="handleClose">
            <el-form ref="ruleFormRef" :rules="rules" label-width="100px" :model="medicineMsg" style="max-width: 460px">
                <el-form-item label="药品名称" prop="title">
                    <el-input v-if="dialogTitle != '药品详情'" v-model="medicineMsg.title" />
                    <span v-else>{{ medicineMsg.title }}</span>
                </el-form-item>
                <el-form-item label="活动价" prop="market_price">
                    <el-input v-if="dialogTitle != '药品详情'" v-model="medicineMsg.market_price" />
                    <span v-else>{{ medicineMsg.market_price }}</span>
                </el-form-item>
                <el-form-item label="原价" prop="sale_price">
                    <el-input v-if="dialogTitle != '药品详情'" v-model="medicineMsg.sale_price" />
                    <span v-else>{{ medicineMsg.sale_price }}</span>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="medicineMsg.type" placeholder="类型" v-if="dialogTitle != '药品详情'">
                        <el-option label="西药" value="西药" />
                        <el-option label="中药" value="中药" />
                        <el-option label="中成药" value="中成药" />
                        <el-option label="其他" value="其他" />
                    </el-select>
                    <span v-else>{{ medicineMsg.type }}</span>
                </el-form-item>
                <el-form-item label="规格" prop="unit">
                    <el-select v-model="medicineMsg.unit" placeholder="规格" v-if="dialogTitle != '药品详情'">
                        <el-option label="盒" value="盒" />
                        <el-option label="片" value="片" />
                        <el-option label="粒" value="粒" />
                        <el-option label="贴" value="贴" />
                    </el-select>
                    <span v-else>{{ medicineMsg.unit }}</span>
                </el-form-item>

                <el-form-item label="图片" prop="pic">
                    <el-input v-model="medicineMsg.pic" v-if="dialogTitle != '药品详情'" />
                    <img v-else :src="medicineMsg.pic" class="pic" alt="" />
                </el-form-item>

                <el-form-item label="功能主治" prop="fun">
                    <el-input v-model="medicineMsg.fun" v-if="dialogTitle != '药品详情'" />
                    <span v-else>{{ medicineMsg.fun }}</span>
                </el-form-item>

                <el-form-item label="不良反应" prop="bad">
                    <el-input v-model="medicineMsg.bad" v-if="dialogTitle != '药品详情'" />
                    <span v-else>{{ medicineMsg.bad }}</span>
                </el-form-item>
                <el-form-item label="禁忌" prop="need">
                    <el-input v-model="medicineMsg.need" v-if="dialogTitle != '药品详情'" />
                    <span v-else>{{ medicineMsg.need }}</span>
                </el-form-item>
                <el-form-item label="生产企业" prop="company">
                    <el-input v-model="medicineMsg.company" v-if="dialogTitle != '药品详情'" />
                    <span v-else>{{ medicineMsg.company }}</span>
                </el-form-item>
                <el-form-item label="批号" prop="num">
                    <el-input v-model="medicineMsg.num" v-if="dialogTitle != '药品详情'" />
                    <span v-else>{{ medicineMsg.num }}</span>
                </el-form-item>
                <el-form-item label="详情介绍" prop="detail">
                    <el-input type="textarea" v-model="medicineMsg.detail" v-if="dialogTitle != '药品详情'" />
                    <span v-else v-html="medicineMsg.detail"></span>
                </el-form-item>
            </el-form>


            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitForm(ruleFormRef)">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { Delete, Edit, CreditCard } from "@element-plus/icons-vue";

let { proxy }: any = getCurrentInstance()

// 获取药品的顺序
let medicineList = reactive({
    data: []
})

// 药品列表
const getMedicineList = async () => {
    let { data: res } = await proxy.$http.get('/medicine/list')
    // console.log('药品列表', res);
    if (res.code == 200) {
        //存值
        medicineList.data = res.data
        // total.value = res.total


    } else {
        ElMessage({
            message: '获取药品列表失败',
            type: 'error',
            duration: 500
        })
    }

}
// ------------------------------------------
// 对话框的显示与隐藏
let dialogVisible = ref(false)
let dialogTitle = ref('')
const handleClose = () => {
    dialogVisible.value = false
    // console.log('关闭前')
}

let medicineMsg = reactive({
    title: '',
    market_price: '',
    sale_price: '',
    type: '',
    unit: '',
    pic: '',
    fun: '',
    bad: '',
    need: '',
    company: '',
    num: '',
    detail: ''
})

const rules = reactive({
    title: [{ required: true, message: '请输入药品名称', trigger: 'blur' }],
    market_price: [{ required: true, message: '选项不能为空', trigger: 'blur' }],
    sale_price: [{ required: true, message: '选项不能为空', trigger: 'blur' }],
    type: [{ required: true, message: '选项不能为空', trigger: 'blur' }],
    unit: [{ required: true, message: '选项不能为空', trigger: 'blur' }],
    pic: [{ required: true, message: '选项不能为空', trigger: 'blur' }],
    fun: [{ required: true, message: '选项不能为空', trigger: 'blur' }],
    bad: [{ required: true, message: '选项不能为空', trigger: 'blur' }],
    need: [{ required: true, message: '选项不能为空', trigger: 'blur' }],
    company: [{ required: true, message: '选项不能为空', trigger: 'blur' }],
    num: [{ required: true, message: '选项不能为空', trigger: 'blur' }],
    detail: [{ required: true, message: '选项不能为空', trigger: 'blur' }]
})

let ruleFormRef = ref()

// 添加药品的按钮
const addMedicineBtn = () => {
    dialogVisible.value = true
    dialogTitle.value = '添加药品'
    //所有的数据 清空
    Object.keys(medicineMsg).forEach(key => {
        medicineMsg[key] = ''
    })

}

// 点击确定提交的按钮
const submitForm = async (formEl: FormInstance | undefined) => {
    await formEl.validate(valid => {
        if (valid) {
            // console.log('成功')
            //调用添加药品的方法
            if (dialogTitle.value == '添加药品') {
                confirmAddMeidice()
            }
            if (dialogTitle.value == '修改药品') {
                confirmUpdateMeidice()
            }
        } else {
            // console.log('校验不通过')
            ElMessage({
                message: '选项输入不完整',
                type: 'error',
                duration: 700
            })
        }
    })
}

// 确定添加药品
const confirmAddMeidice = async () => {
    let { data: res } = await proxy.$http.post('/medicine/add', medicineMsg)
    console.log('添加药品', res);
    if (res.code == 200) {
        ElMessage({
            message: '添加药品成功',
            type: 'success',
            duration: 500,
            onClose: () => {
                dialogVisible.value = false
                //刷新页面
                getMedicineList()
            }
        })
    } else {
        ElMessage({
            message: '添加药品失败',
            type: 'error',
            duration: 500
        })
    }
}

// 修改按钮
const update_ = val => {
    // console.log(val);
    dialogTitle.value = '修改药品'
    dialogVisible.value = true
    medicineMsg = val
    // console.log(medicineMsg)
}

// 修改提交按钮
const confirmUpdateMeidice = async () => {
    let { data: res } = await proxy.$http.put('/medicine/update', medicineMsg)
    console.log(res)
    if (res.code == 200) {
        ElMessage({
            message: '修改药品成功',
            type: 'success',
            duration: 500,
            onClose: () => {
                dialogVisible.value = false
                getMedicineList()
            }
        })
    } else {
        ElMessage({
            message: '修改药品失败',
            type: 'error',
            duration: 600
        })
    }
}

// 详情按钮
const detail_ = val => {
    // console.log(val);
    dialogTitle.value = '药品详情'
    dialogVisible.value = true
    medicineMsg = val

}
// 删除按钮
const delete_ = async (val) => {
    // console.log('删除')
    // console.log(val);
    let { data: res } = await proxy.$http.delete(`medicine?id=${val.id}`)
    // console.log(val);
    if (res.code == 200) {
        ElMessage({
            message: '删除成功',
            type: 'success',
            duration: 500,
            onClose: () => {
                getMedicineList()
            }
        })
    } else {
        ElMessage({
            message: '删除失败',
            type: 'error',
            duration: 600
        })
    }


}


//分页数据
const pageSize = ref(10)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)
const currentPage = ref(1)
const total = ref(4)

const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`)
}

onMounted(() => {
    getMedicineList()
})

</script>

<style lang="less" scoped>
.el-pagination {
    // display: none;
    // text-align: center;
    // float: left;
    // display: block;
    //   text-align: left;
    //    float: left;

}

.pic {
    width: 300px;
}
</style>