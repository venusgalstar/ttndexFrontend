import React from 'react'
import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Heading, Text, Button, Image, Card } from '@pancakeswap/uikit'
import styled from 'styled-components'

const SlideImg = styled.img`
    width: 260px;
    height: 200px;
    ${({ theme }) => theme.mediaQueries.xs} {
        width: 260px;
        height: 200px;
    }

    ${({ theme }) => theme.mediaQueries.md} {
        width: 400px;
        height: 200px;
    }

    ${({ theme }) => theme.mediaQueries.lg} {
        width: 600px;
        height: 200px;
    }
`


const ComingSoon = () => {

    const carouseImg = {
        maxWidth: '400px',
        margin: '0 auto'
    }

    return (
        <Carousel 
        autoPlay
        interval={2000}
        infiniteLoop
        showArrows={false}
        showStatus={false}
        showIndicators={false}
        width='100'        
        >
            {/* <div style={carouseImg}>
                <SlideImg src="/images/baners/bridgeswap-farms.webp" alt='TTNDEX farms'/>
            </div>
            <div style={carouseImg}>
                <SlideImg src="/images/baners/bridgeswap-lottery.webp" alt='TTNDEX lottery'/>
            </div>
            <div style={carouseImg}>
                <SlideImg src="/images/baners/bridgeswap-pools.webp" alt='TTNDEX-pools'/>
            </div> */}
            <div style={carouseImg}>
                <SlideImg src="/images/baners/defi2.0-zap.webp" alt='defi2.0-zap'/>
            </div>
            <div style={carouseImg}>
                <SlideImg src="/images/baners/referral-program.webp" alt='referral-program'/>
            </div>
            
        </Carousel>
    
    )
}

export default ComingSoon