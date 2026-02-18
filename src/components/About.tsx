import React from 'react';
import { PortfolioConfig } from '../config/portfolio';

const About = () => {
    return (<h1>
        Hey, I'm {PortfolioConfig.name.split(' ')[0]}
    </h1>)
}

export default About;