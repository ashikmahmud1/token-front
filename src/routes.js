/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, {lazy} from 'react';
import {Redirect} from 'react-router-dom';

import AuthLayout from './layouts/Auth';
import ErrorLayout from './layouts/Error';
import DashboardLayout from './layouts/Dashboard';
import PresentationView from './views/Presentation';
import NormalLayout from './layouts/Normal';

const routes = [
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/presentation"/>
  },
  {
    path: '/auth',
    component: AuthLayout,
    routes: [
      {
        path: '/auth/login',
        exact: true,
        component: lazy(() => import('views/Login'))
      },
      {
        component: () => <Redirect to="/errors/error-404"/>
      }
    ]
  },
  {
    path: '/token',
    component: NormalLayout,
    routes: [
      {
        path: '/token/queue-list/:number',
        exact: true,
        component: lazy(() => import('views/Token/TokenQueueList'))
      },
      {
        path: '/token/waiting-list/:number',
        exact: true,
        component: lazy(() => import('views/Token/TokenWaitingList'))
      }
    ]
  },
  {
    path: '/errors',
    component: ErrorLayout,
    routes: [
      {
        path: '/errors/error-401',
        exact: true,
        component: lazy(() => import('views/Error401'))
      },
      {
        path: '/errors/error-404',
        exact: true,
        component: lazy(() => import('views/Error404'))
      },
      {
        path: '/errors/error-500',
        exact: true,
        component: lazy(() => import('views/Error500'))
      },
      {
        component: () => <Redirect to="/errors/error-404"/>
      }
    ]
  },
  {
    route: '*',
    component: DashboardLayout,
    routes: [
      {
        path: '/presentation',
        exact: true,
        component: PresentationView
      },
      //User Routes
      {
        path: '/user/create',
        exact: true,
        component: lazy(() => import('views/User/UserCreate'))
      },
      {
        path: '/user/list',
        exact: true,
        component: lazy(() => import('views/User/UserList'))
      },
      {
        path: '/user/edit/:id',
        exact: true,
        component: lazy(() => import('views/User/UserEdit'))
      },
      // Customer Routes
      {
        path: '/customer/create',
        exact: true,
        component: lazy(() => import('views/Customer/CustomerCreate'))
      },
      {
        path: '/customer/list',
        exact: true,
        component: lazy(() => import('views/Customer/CustomerList'))
      },
      {
        path: '/customer/edit/:id',
        exact: true,
        component: lazy(() => import('views/Customer/CustomerEdit'))
      },
      // Department Routes
      {
        path: '/department/create',
        exact: true,
        component: lazy(() => import('views/Department/DepartmentCreate'))
      },
      {
        path: '/department/list',
        exact: true,
        component: lazy(() => import('views/Department/DepartmentList'))
      },
      {
        path: '/department/edit/:id',
        exact: true,
        component: lazy(() => import('views/Department/DepartmentEdit'))
      },
      //  Display  Routes
      {
        path: '/display/create',
        exact: true,
        component: lazy(() => import('views/Display/DisplayCreate'))
      },
      {
        path: '/display/list',
        exact: true,
        component: lazy(() => import('views/Display/DisplayList'))
      },
      {
        path: '/display/show',
        exact: true,
        component: lazy(() => import('views/Display/DisplayShow'))
      },
      {
        path: '/display/edit/:id',
        exact: true,
        component: lazy(() => import('views/Display/DisplayEdit'))
      },
      // Counter Routes
      {
        path: '/counter/create',
        exact: true,
        component: lazy(() => import('views/Counter/CounterCreate'))
      },
      {
        path: '/counter/list',
        exact: true,
        component: lazy(() => import('views/Counter/CounterList'))
      },
      {
        path: '/counter/edit/:id',
        exact: true,
        component: lazy(() => import('views/Counter/CounterEdit'))
      },
      // Token Routes
      {
        path: '/create/token',
        exact: true,
        component: lazy(() => import('views/Token/TokenCreate'))
      },
      {
        path: '/call/token',
        exact: true,
        component: lazy(() => import('views/Token/TokenCall'))
      },
      {
        path: '/report/served',
        exact: true,
        component: lazy(() => import('views/Report/ServedReportList'))
      },
      {
        path: '/report/user',
        exact: true,
        component: lazy(() => import('views/Report/UserReportList'))
      },
      {
        path: '/report/overall',
        exact: true,
        component: lazy(() => import('views/Report/OverallReportList'))
      },
      {
        path: '/setting',
        exact: true,
        component: lazy(() => import('views/Setting'))
      },
      {
        component: () => <Redirect to="/errors/error-404"/>
      }
    ]
  }
];

export default routes;
