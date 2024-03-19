<template>
    <div class="homeBox common-layout">
        <el-container>
            <!-- 头部 -->
            <el-header>
                <div class="left">
                    <img src="../assets/logo.png" @click="$router.push('/home/welcome')" alt="">
                    <p>郑州大学附属郑州市中心医院医务管理系统</p>
                </div>
                <div class="right">
                    <el-popconfirm title="确定退出登陆吗" @confirm="loginOut" confirm-button-text="是" cancel-button-text="否"
                        cancel-button-type="danger">
                        <template #reference>
                            <el-icon>
                                <SwitchButton />
                            </el-icon>
                        </template>
                    </el-popconfirm>
                </div>
            </el-header>
            <!-- 主体 -->
            <el-container>
                <!-- 侧边栏 -->
                <el-aside :width="isCollapse ? '65px' : '200px'">
                    <div class="collapse" @click="isCollapse = !isCollapse">|||</div>
                    <el-menu active-text-color="#13b9c9" :collapse-transition="false" :router="true" :collapse="isCollapse"
                        :unique-opened="true" background-color="#056f89" class="el-menu-vertical-demo" default-active="2"
                        text-color="#fff">
                        <el-sub-menu :index="item.id.toString()" v-for="(item, index) in menuList.data" :key="item.id">
                            <template #title>
                                <el-icon>
                                    <component :is="icons[index]"></component>
                                </el-icon>
                                <span>{{ item.authName }}</span>
                            </template>
                            <el-menu-item @click="saveName(item.authName, childItem.authName)" :index="childItem.path"
                                v-for="(childItem, index) in item.children" :key="childItem.id">

                                <el-icon>
                                    <Menu />
                                </el-icon>
                                {{ childItem.authName }}</el-menu-item>
                        </el-sub-menu>
                    </el-menu>
                </el-aside>
                <!-- main -->
                <el-main>
                    <!-- 面包屑 -->

                    <el-breadcrumb class="breadBox" :separator-icon="ArrowRight" v-if="$route.path != '/home/welcome'">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{ menuNames.name1 }}</el-breadcrumb-item>
                        <el-breadcrumb-item>{{ menuNames.name2 }}</el-breadcrumb-item>
                    </el-breadcrumb>


                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>


<script lang="ts" setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'

import { ArrowRight } from '@element-plus/icons-vue'

import { useRouter } from 'vue-router'
const router = useRouter() //创建路由的实例
let { proxy }: any = getCurrentInstance()
const loginOut = () => {
    sessionStorage.removeItem('token')
    ElMessage({
        message: '退出登录成功',
        type: 'success',
        duration: 500,
        onClose: () => {
            router.push('/login')
        }
    })
}

// 面包屑

let menuNames = reactive({
    name1: '',
    name2: ''
})
const saveName = (name1, name2) => {
    menuNames.name1 = name1,
    menuNames.name2 = name2
}

// 缩
let isCollapse = ref(false);

const getMenuList = async () => {
    let { data: res } = await proxy.$http.get('/menu/list')
    // console.log(res);

    if (res.code == 200) {
        menuList.data = res.data

    }

}


// 页面加载调用数据
onMounted(() => {
    getMenuList()
})

//侧边栏数据部分
//#region
let menuList = reactive({
    data: []
})
//侧边栏图标数组
const icons = reactive([
    'User',
    'SwitchFilled',
    'Document',
    'MessageBox',
    'Location',
    'Shop',
    'Orange',
    'Suitcase',
    'VideoPlay'
])
</script>

<style lang="less" scoped>
.homeBox {
    width: 100%;
    height: 100vh;
    // background-color: #d7e88a;

    .el-header {
        background-color: rgb(19, 185, 201);
        display: flex;
        justify-content: space-between;

        .left {
            // width: 50%;
            height: 60px;

            text-indent: 30px;
            color: rgb(255, 255, 255);
            font-size: 20px;
            letter-spacing: 3px;
            font-weight: 500;
            font-family: '宋体-简';
            display: flex;
            align-items: center;

            img {
                width: 50px;
                height: 50px;
                display: inline-block;

            }
        }

        .right {
            display: flex;
            align-items: center;
            color: white;
            font-size: 35px;
            margin-right: 20px;
        }


    }

    .el-container {
        .el-aside {
            background-color: #056f89;
            height: calc(100vh - 60px);
            transition: all .2s linear;

            .collapse {
                text-align: center;
                color: #fff;
                letter-spacing: 3px;
                height: 40px;
                line-height: 40px;
                border-bottom: .5px solid rgb(255, 255, 255);
                cursor: pointer;
                //  transition: all 1s linear;
            }

            .el-menu {
                border: none;

            }
        }

        .el-main {
            //   background-color: pink;
            background: url(../assets/mainBj.jpg) no-repeat;
            background-size: cover;

            .breadBox {
                margin-bottom: 15px;
            }
        }
    }


}
</style>