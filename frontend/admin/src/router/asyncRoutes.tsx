import { lazy } from 'react'
import type { IRoute } from '.'

type ImportMetaGlob = Record<string, () => Promise<{ default: React.ComponentType }>>

const modules = import.meta.glob(['../views/**/*.(t|j)sx', '!../views/basics/**']) as ImportMetaGlob

const asyncRoutes: Array<IRoute> = Object.entries(modules).map(([key, value]) => {
  const path = key
    .replace('../views', '')
    .replace(/\.(j|t)sx$/, '')
    .replace(/\/index$/, '')

  return {
    path,
    element: (Component => <Component />)(lazy(value)),
    meta: {
      title: path,
      icon: <div className={`icon-[bi--grid-fill]`} />,
    },
  }
})

const menuList = buildTree(asyncRoutes)

function buildTree(routes: IRoute[]): IRoute[] {
  const root: IRoute[] = []
  routes.forEach((route) => {
    const parts = route.path.split('/').filter(part => part)
    let currentLevel = root

    parts.forEach((_part, index) => {
      const partPath = `/${parts.slice(0, index + 1).join('/')}`
      let existingNode = currentLevel.find(node => node.path === partPath)

      if (!existingNode) {

        // 加载图标
        let iconName: string;
        if(partPath == '/aindex') { iconName = 'icon-[bi--house-fill]' }
        else if(partPath == '/member') { iconName = 'icon-[bi--people-fill]' }
        else { iconName = 'icon-[bi--grid-fill]' }

        existingNode = {
          path: partPath,
          element: null,
          children: [],
          meta: {
            title: partPath.split('/').slice(-1)[0],
            icon: <div className={iconName} />,
          },
        }
        currentLevel.push(existingNode)
      }

      if (index === parts.length - 1) {
        existingNode.element = route.element
        existingNode.meta = { ...route.meta, ...existingNode.meta }
      }

      if (!existingNode.children) {
        existingNode.children = []
      }

      currentLevel = existingNode.children
    })
  })

  return root
}
export { asyncRoutes, menuList }
