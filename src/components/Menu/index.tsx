import React from 'react'
import { Menu as UikitMenu } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useAuth from 'hooks/useAuth'
import { usePriceCakeBusd, useProfile } from 'state/hooks'
import getChainLogo from 'utils/getChainLogo'
import getChainName from 'utils/getChainName'
import config from './config'

const Menu = (props) => {
  const { account, chainId } = useWeb3React()
  const { login, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const cakePriceUsd = usePriceCakeBusd()
  const { profile } = useProfile()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const platform = config(t).find((link) => link.href === window.location.pathname)

  // console.log("cakePriceUsd", cakePriceUsd)
  
  return (
    <UikitMenu
      netLogo={chainId !== undefined ? getChainLogo(chainId) : undefined}
      netName={chainId !== undefined ? getChainName(chainId) : undefined}
      platform={platform.label}
      account={account}
      login={login}
      logout={logout}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      cakePriceUsd={Number.isNaN(cakePriceUsd.toNumber()) === true ? 0 : cakePriceUsd.toNumber()}
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
