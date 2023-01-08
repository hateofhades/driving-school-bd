import Vue from "vue";
import VueRouter, { NavigationGuardNext, RouteConfig, Route } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Profile from "../views/Profile.vue";
import MyInstructor from "../views/MyInstructor.vue";
import BookLesson from "../views/BookLesson.vue";
import MyLessons from "../views/MyLessons.vue";
import MyTrips from "../views/MyTrips.vue";

import AdminUsers from "../views/admin/Users.vue";
import AdminStudents from "../views/admin/Students.vue";
import AdminInstructors from "../views/admin/Instructors.vue";

import store from "@/store";

Vue.use(VueRouter);

const isLogged = (to: Route, from: Route, next: NavigationGuardNext) => {
  if (store.getters.getUser.id !== -1) {
    next();
  } else {
    next("/login");
  }
};

const isAdmin = (to: Route, from: Route, next: NavigationGuardNext) => {
  if (store.getters.getUser.TipCont === "A") {
    next();
  } else {
    next("/login");
  }
};

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    beforeEnter: isLogged
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    beforeEnter: isLogged
  },
  {
    path: "/myInstructor",
    name: "myInstructor",
    component: MyInstructor,
    beforeEnter: isLogged
  },
  {
    path: "/bookLesson",
    name: "bookLesson",
    component: BookLesson,
    beforeEnter: isLogged
  },
  {
    path: "/myLessons",
    name: "myLessons",
    component: MyLessons,
    beforeEnter: isLogged
  },
  {
    path: "/myTrips",
    name: "myTrips",
    component: MyTrips,
    beforeEnter: isLogged
  },
  {
    path: "/admin/users",
    name: "adminUsers",
    component: AdminUsers,
    beforeEnter: isAdmin
  },
  {
    path: "/admin/students",
    name: "adminStudents",
    component: AdminStudents,
    beforeEnter: isAdmin
  },
  {
    path: "/admin/instructors",
    name: "adminInstructors",
    component: AdminInstructors,
    beforeEnter: isAdmin
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
