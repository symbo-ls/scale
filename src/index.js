'use strict'

import './define'
import './icon'
import style from './style'

import DOM from '@rackai/domql'
import { IconText, Input, Link, Select, Sequence, set, Shape } from '@rackai/symbols'

import preview from './preview'
import table from './table'
import sequence from './sequence'

set('theme', {
  name: 'document',
  color: '#999'
}, {
  name: 'field',
  color: 'white',
  background: '#fff3'
}, {
  name: 'button',
  color: 'white',
  background: '#fff1'
})

const scales = Object.keys(Sequence).map((key) => {
  const value = Sequence[key]
  return { value, text: value, key }
})

const symbolsMap = {
  base: 'b',
  scale: 's',
  borderRadius: 'r',
  paddingLeft: 'L',
  paddingTop: 'T',
  paddingRight: 'R',
  paddingBottom: 'B',
  other: 'o'
}

var dom = DOM.create({
  style,
  key: 'app',

  proto: Shape,
  theme: 'document',
  round: 0,

  state: {
    fromPath: false,
    base: 17,
    scale: 1.618
  },

  logo: {
    proto: [Link, IconText],
    icon: 'logo',
    href: '/',
    style: {
      color: 'white',
      height: 'auto',
      position: 'fixed',
      fontSize: '1.6em',
      padding: '.8em',
      top: 0,
      left: 0
    }
  },

  h2: '(em) Sizing scale',

  fields: {
    style: {
      display: 'flex',
      gap: '1em'
    },
    childProto: {
      theme: 'field',
      style: {
        border: '0',
        padding: '.35em .65em'
      }
    },
    base: {
      proto: Input,
      placeholder: 'Base',
      type: 'number',
      class: {
        disabled: { '&:disabled': { opacity: 0.7 } }
      },
      attr: {
        value: (el, state) => state.base,
        autofocus: (el, state) => !state.fromPath,
        disabled: (el,state) => state.fromPath
      },
      on: {
        input: (ev, el, state) => state.update({ base: el.node.value })
      }
    },
    scale: {
      proto: Select,
      attr: {
        value: (el, state) => state.scale,
        disabled: (el,state) => state.fromPath
      },

      childProto: {
        define: { value: param => param },
        attr: {
          value: element => element.value,
          selected: (element, state) => element.value == state.scale
        }
      },

      ...scales,

      on: {
        change: (ev, el, state) => state.update({ scale: el.node.value })
      }
    }
  },

  t: {
    style: {
      float: 'left',
      maxWidth: 'calc(100% - 320px)',
    },
    table
  },
  preview,

  on: {
    render: (el, state) => {
      const path = window.location.pathname.slice(1)

      if (!path) return el.update({})

      const arr = path.split(',')
      const obj = { fromPath: true }
      arr.map(v => {
        const k = v.slice(0, 1)
        const key = findByValue(symbolsMap, k)
        const val = v.slice(1)
        obj[key] = val
      })
      state.update(obj)
    },
    stateChange: (el, s) => {
      const state = s.parse()
      const keys = Object.keys(state)
      const arr = []
      keys.map(v => {
        const key = symbolsMap[v]
        const val = state[v]
        if (key && val) arr.push(key + val)
      })
      window.history.pushState(state, null, arr.join(','))
    }
  }
})

function findByValue(obj, searchKey) {
  return Object.keys(obj).filter(key => obj[key] === searchKey)[0]
}