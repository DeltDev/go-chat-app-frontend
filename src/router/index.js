import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/LoginForm.vue';
import Register from '../components/RegisterForm.vue';
import Dashboard from '../components/Dashboard.vue'; 
import api from '../services/api';

const routes = [
    { 
        path: '/login', 
        name: 'Login',
        component: Login,
        meta: { 
            guestOnly: true,
            showParticles: true, 
            index: 1             
        } 
    },
    { 
        path: '/register', 
        name: 'Register',
        component: Register,
        meta: { 
            guestOnly: true,
            showParticles: true, 
            index: 2            
        }
    },
    { 
        path: '/dashboard', 
        name: 'Dashboard',
        component: Dashboard,
        meta: { 
            requiresAuth: true,
            showParticles: false, 
            index: 3              
        }
    },

    {
        path: '/',
        redirect: '/login'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});


router.beforeEach(async (to, from, next) => {

    let isAuthenticated = false;
    try {
        await api.get('/check-auth'); 
        isAuthenticated = true;
    } catch (error) {
        isAuthenticated = false;
    }

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } 

    else if (to.meta.guestOnly && isAuthenticated) {
        next('/dashboard');
    } 

    else {
        next();
    }
});

export default router;