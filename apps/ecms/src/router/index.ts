import { piniaUserRecord } from "@/store/modules/user";
import { App } from "vue";
import { createRouter, createWebHistory } from "vue-router";

// 头部页面
const HeaderLayoutView = () => import("@/components/layout/HeaderLayout.vue");
// 登录页面
const LoginView = () => import("@/views/LoginView.vue");

// 首页/设备列表
const DeviceListView = () => import("@/views/device-list/DeviceListView.vue");

const RouterConfig = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      components: {
        header: HeaderLayoutView,
        default: LoginView,
      },
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/",
      redirect: "/device-list",
    },
    {
      path: "/device-list",
      name: "DeviceListView",
      components: {
        header: HeaderLayoutView,
        default: DeviceListView,
      },
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

export default RouterConfig;

// 路由守卫
const createRouterGuards = () => {
  // 定义路由拦截
  RouterConfig.beforeEach(async (to, from, next) => {
    const userStore = piniaUserRecord();
    // TODO: 根据实际业务改，根据本地 accessToken 去验证或者 check session 等
    // console.log("createRouterGuards", to, from);
    // console.log("userStore", userStore.isLoggedIn);

      


    // 已经登录，禁止前往登录页
    if (userStore.isLoggedIn && to.name === "login") {
      return next("/");
    }

    // 未登录，禁止前往非登录页
    if (to.meta.requiresAuth && !userStore.isLoggedIn) {
      return next("/login");
    }

    return next();
  });
};

export const setupRouter = (app: App) => {
  createRouterGuards();
  app.use(RouterConfig);
};
