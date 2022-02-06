import React from 'react'
import { useLocation } from 'react-router'
import { Menu as UikitMenu } from '@pancakeswap/uikit'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { usePriceMiniDogeBusd } from 'state/farms/hooks'
import { useProfile } from 'state/profile/hooks'
import config from './config'
import UserMenu from './UserMenu'
import GlobalSettings from './GlobalSettings'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'

const Menu = (props) => {
  const { isDark, toggleTheme } = useTheme()
  const miniDogePriceUsd = usePriceMiniDogeBusd()
  const { profile } = useProfile()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { pathname } = useLocation()

  const activeMenuItem = getActiveMenuItem({ menuConfig: config(t), pathname })
  const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

  return (
    <UikitMenu
      userMenu={<UserMenu />}
      globalMenu={<GlobalSettings />}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      miniDogePriceUsd={miniDogePriceUsd.toNumber()}
      activeItem={activeMenuItem?.href}
      activeSubItem={activeSubMenuItem?.href}
      links={config(t)}
      profile={{
        username: profile?.username,
        image: profile?.nft ? `/images/nfts/${profile.nft?.images.sm}` : undefined,
        profileLink: '/profile',
        noProfileLink: '/profile',
        showPip: !profile?.username,
      }}
      {...props}
    />
  )
}

export default Menu
