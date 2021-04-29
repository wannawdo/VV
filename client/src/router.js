import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';

Vue.use(Router);

export const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/acasa',
      component: Home
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/profil',
      name: 'profile',
      // lazy-loaded
      component: () => import('./views/Profile.vue')
    },
    {
      path: '/gestionareconturi',
      name: 'gestionareconturi',
      // lazy-loaded
      component: () => import('./views/GestionareConturi.vue')
    },
    {
      path: '/candidati',
      name: 'candidati',
      // lazy-loaded
      component: () => import('./views/Candidati.vue')
    },
    {
      path: '/vot',
      name: 'vot',
      // lazy-loaded
      component: () => import('./views/Vote.vue')
    },
    {
      path: '/candidatura',
      name: 'candidatura',
      // lazy-loaded
      component: () => import('./views/Candidatura.vue')
    },
    {
      path: '/sesiunivot',
      name: 'sesiunivot',
      // lazy-loaded
      component: () => import('./views/VoteSessions.vue')
    }
  ]
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register', '/acasa'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('user');
  
    // trying to access a restricted page + not logged in
    // redirect to login page
    if (authRequired && !loggedIn) {
      next('/login');
    } else {
      next();
    }
  });