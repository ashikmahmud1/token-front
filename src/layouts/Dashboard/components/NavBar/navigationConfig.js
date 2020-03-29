/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React from 'react';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import PersonIcon from '@material-ui/icons/PersonOutlined';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import TvOutlinedIcon from '@material-ui/icons/TvOutlined';
import ImportContactsOutlinedIcon from '@material-ui/icons/ImportContactsOutlined';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

export default [
  {
    title: 'Pages',
    pages: [
      {
        title: 'User',
        href: '/user',
        icon: PersonIcon,
        access: {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: false},
        children: [
          {
            title: 'Create',
            href: '/user/create'
          },
          {
            title: 'List',
            href: '/user/list'
          }
        ]
      },
      {
        title: 'Department',
        href: '/department',
        icon: PeopleIcon,
        access: {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: false},
        children: [
          {
            title: 'Create',
            href: '/department/create'
          },
          {
            title: 'List',
            href: '/department/list'
          }
        ]
      },
      {
        title: 'Customer',
        href: '/customer',
        icon: PersonIcon,
        access: {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: true},
        children: [
          {
            title: 'Create',
            href: '/customer/create'
          },
          {
            title: 'List',
            href: '/customer/list'
          }
        ]
      },
      {
        title: 'Counter',
        href: '/counter',
        icon: HomeOutlinedIcon,
        access: {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: false},
        children: [
          {
            title: 'Create',
            href: '/counter/create'
          },
          {
            title: 'List',
            href: '/counter/list'
          }
        ]
      },
      {
        title: 'Display',
        href: '/display',
        icon: TvOutlinedIcon,
        access: {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: true},
        children: [
          {
            title: 'Create',
            href: '/display/create'
          },
          {
            title: 'List',
            href: '/display/list'
          }
        ]
      },
      {
        title: 'Token',
        href: '/token',
        icon: ImportContactsOutlinedIcon,
        access: {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: false},
        children: [
          {
            title: 'Create',
            href: '/create/token'
          },
          {
            title: 'Call',
            href: '/call/token'
          }
        ]
      },
      {
        title: 'Report',
        href: '/report',
        icon: AssessmentIcon,
        access: {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: false},
        children: [
          {
            title: 'Overall Report',
            href: '/report/overall'
          },
          {
            title: 'User Report',
            href: '/report/user'
          },
          {
            title: 'Served Report',
            href: '/report/served'
          }
        ]
      },
      {
        title: 'Display',
        href: '/display/show',
        icon: TvOutlinedIcon,
        access: {ROLE_ADMIN: false, ROLE_STAFF: true, ROLE_TOKENIST: false},
      },
      {
        title: 'Token Create',
        href: '/create/token',
        icon: ImportContactsOutlinedIcon,
        access: {ROLE_ADMIN: false, ROLE_STAFF: false, ROLE_TOKENIST: true},
      },
      {
        title: 'Token Call',
        href: '/call/token',
        icon: ImportContactsOutlinedIcon,
        access: {ROLE_ADMIN: false, ROLE_STAFF: true, ROLE_TOKENIST: false},
      },
      {
        title: 'Profile',
        href: '/setting',
        icon: AccountCircleIcon,
        access: {ROLE_ADMIN: true, ROLE_STAFF: true, ROLE_TOKENIST: true},
      }
    ]
  }
];
