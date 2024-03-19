<template>
    <div class="loginBox">
        <el-form ref="ruleFormRef" :rules="rules" :model="loginInfo" style="max-width: 460px">

            <el-form-item prop="uname">
                <el-input prefix-icon="User" v-model="loginInfo.uname" placeholder="请输入用户名" />
            </el-form-item>

            <el-form-item prop="upwd">
                <el-input prefix-icon="Lock" v-model="loginInfo.upwd" show-password placeholder="请输入用密码" />
            </el-form-item>
            <el-row class="mb-4">
                <el-button type="primary" @click="submitForm(ruleFormRef)">登陆</el-button>
                <el-button @click="reset">重置</el-button>
            </el-row>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'

import { useRouter } from 'vue-router'
const router = useRouter() //创建路由的实例
let { proxy }: any = getCurrentInstance()

const ruleFormRef = ref()
const loginInfo = reactive({
    uname: 'admin',
    upwd: '123456',
})
const rules = reactive({
    uname: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 6, message: '用户名长度3-6位', trigger: 'blur' },
    ],

    upwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 12, message: '密码长度6-12位', trigger: 'blur' }
    ]
})

// 登陆的方法
const login = async () => {
    let { data: res } = await proxy.$http.post('/users/login', loginInfo)
    console.log(res);
    if (res.code == 200) {
        sessionStorage.setItem('token', res.token)
        ElMessage({
            message: res.msg,
            duration: 500,
            type: 'success',
            onClose: () => {
                //跳转页面到首页
                router.push('/home')
            }
        })
    } else {
        //登陆失败 清除token
        sessionStorage.removeItem('token')
        ElMessage({
            message: res.msg,
            duration: 500,
            type: 'error'
        })
    }

}

// 登陆验证
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            login()
        } else {
            ElMessage({
                message: '用户名或密码输入格式错误',
                type: 'error',
                duration: 600
            })
        }
    })
}

// 重置登录
const reset = () => {
    loginInfo.uname = ''
    loginInfo.upwd = ''
    ElMessage({
        message: '重置成功',
        type: 'success',
        duration: 500,
        showClose: true
    })
}

</script>

<style lang="less" scoped>
.loginBox {
    width: 100%;
    height: 100%;
    background: url(../assets/background.png) no-repeat;
    background-size: cover;
    position: relative;

    .el-form {
        width: 25%;
        // background-color: #fff;
        padding: 30px 20px;
        box-sizing: border-box;
        position: absolute;
        right: 110px;
        top: 50%;
        border: 2px solid #54b9c9;
        border-radius: 8px;
    }
}
</style>