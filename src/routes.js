/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, {lazy} from 'react';
import {Redirect} from 'react-router-dom';

import AuthLayout from './layouts/Auth';
import ErrorLayout from './layouts/Error';
import DashboardLayout from './layouts/Dashboard';
import DashboardAnalyticsView from './views/DashboardAnalytics';
import DashboardDefaultView from './views/DashboardDefault';
import OverviewView from './views/Overview';
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
        path: '/auth/register',
        exact: true,
        component: lazy(() => import('views/Register'))
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
        path: '/calendar',
        exact: true,
        component: lazy(() => import('views/Calendar'))
      },
      {
        path: '/changelog',
        exact: true,
        component: lazy(() => import('views/Changelog'))
      },
      {
        path: '/chat',
        exact: true,
        component: lazy(() => import('views/Chat'))
      },
      {
        path: '/chat/:id',
        exact: true,
        component: lazy(() => import('views/Chat'))
      },
      {
        path: '/dashboards/analytics',
        exact: true,
        component: DashboardAnalyticsView
      },
      {
        path: '/dashboards/default',
        exact: true,
        component: DashboardDefaultView
      },
      {
        path: '/invoices/:id',
        exact: true,
        component: lazy(() => import('views/InvoiceDetails'))
      },
      {
        path: '/kanban-board',
        exact: true,
        component: lazy(() => import('views/KanbanBoard'))
      },
      {
        path: '/mail',
        exact: true,
        component: lazy(() => import('views/Mail'))
      },
      {
        path: '/management/customers',
        exact: true,
        component: lazy(() => import('views/CustomerManagementList'))
      },
      {
        path: '/management/customers/:id',
        exact: true,
        component: lazy(() => import('views/CustomerManagementDetails'))
      },
      {
        path: '/management/customers/:id/:tab',
        exact: true,
        component: lazy(() => import('views/CustomerManagementDetails'))
      },
      {
        path: '/management/projects',
        exact: true,
        component: lazy(() => import('views/ProjectManagementList'))
      },
      {
        path: '/management/orders',
        exact: true,
        component: lazy(() => import('views/OrderManagementList'))
      },
      {
        path: '/management/orders/:id',
        exact: true,
        component: lazy(() => import('views/OrderManagementDetails'))
      },
      {
        path: '/overview',
        exact: true,
        component: OverviewView
      },
      {
        path: '/presentation',
        exact: true,
        component: PresentationView
      },
      {
        path: '/profile/:id',
        exact: true,
        component: lazy(() => import('views/Profile'))
      },
      {
        path: '/profile/:id/:tab',
        exact: true,
        component: lazy(() => import('views/Profile'))
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
        path: '/token-create',
        exact: true,
        component: lazy(() => import('views/Token/TokenCreate'))
      },
      {
        path: '/token-call',
        exact: true,
        component: lazy(() => import('views/Token/TokenCall'))
      },
      {
        path: '/served-report',
        exact: true,
        component: lazy(() => import('views/Report/ServedReportList'))
      },
      {
        path: '/user-report',
        exact: true,
        component: lazy(() => import('views/Report/UserReportList'))
      },
      {
        path: '/overall-report',
        exact: true,
        component: lazy(() => import('views/Report/OverallReportList'))
      },
      {
        path: '/projects/create',
        exact: true,
        component: lazy(() => import('views/ProjectCreate'))
      },
      {
        path: '/projects/:id',
        exact: true,
        component: lazy(() => import('views/ProjectDetails'))
      },
      {
        path: '/projects/:id/:tab',
        exact: true,
        component: lazy(() => import('views/ProjectDetails'))
      },
      {
        path: '/projects',
        exact: true,
        component: lazy(() => import('views/ProjectList'))
      },
      {
        path: '/settings',
        exact: true,
        component: lazy(() => import('views/Settings'))
      },
      {
        path: '/setting',
        exact: true,
        component: lazy(() => import('views/Setting'))
      },
      {
        path: '/settings/:tab',
        exact: true,
        component: lazy(() => import('views/Settings'))
      },
      {
        path: '/social-feed',
        exact: true,
        component: lazy(() => import('views/SocialFeed'))
      },
      {
        path: '/getting-started',
        exact: true,
        component: lazy(() => import('views/GettingStarted'))
      },
      {
        component: () => <Redirect to="/errors/error-404"/>
      }
    ]
  }
];

export default routes;
