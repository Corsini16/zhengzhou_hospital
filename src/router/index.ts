import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../components/Login.vue')
        },
        {
            path: '/home',
            name: 'home',
            component: () => import('../components/Home.vue'),
            redirect: '/home/welcome',
            children: [
                {
                    path: 'welcome',
                    name: 'welcome',
                    component: () => import('../components/Welcome.vue')
                },
                {
                    path: 'users',
                    name: 'users',
                    component: () => import('../components/users/Users.vue')
                },
                {
                    path: 'medicineList',
                    name: 'medicineList',
                    component: () => import('../components/medicine/MedicineList.vue')
                },
                {
                    path: 'newsClassify',
                    name: 'newsClassify',
                    component: () => import('../components/news/NewsClassify.vue')
                },
                {
                    path: 'article',
                    name: 'article',
                    component: () => import('../components/news/Article.vue')
                },
                {
                    path: 'sickness',
                    name: 'sickness',
                    component: () => import('../components/sickness/Sickness.vue')
                },
                {
                    path:'hospital',
                    name:'hospital',
                    component: ()=>import('../components/hospital/Hospital.vue')
                },
                {
                    path:'division',
                    name:'division',
                    component: ()=>import('../components/division/Division.vue')
                },
                {
                    path:'expert',
                    name:'expert',
                    component: ()=>import('../components/expert/Expert.vue')
                },
                {
                    path:'recipe',
                    name:'recipe',
                    component: ()=>import('../components/recipe/Recipe.vue')
                },
                {
                    path:'AD',
                    name:'AD',
                    component: ()=>import('../components/ad/AD.vue')
                }
            ]

        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.fullPath == '/login') {
        next()
    } else {
        let token = sessionStorage.getItem('token')
        if (token) {
            next()
        } else {
            next('/login')
        }
    }
})


export default router