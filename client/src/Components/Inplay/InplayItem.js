import React, { Component } from 'react';
import {
    inplayWrapperStyles
} from './InplayItemStyles'

import { findSimilar } from '../../utils/asyncUtils'

class InplayItem extends Component {
    constructor(){
        super();
        this.getTotal = this.getTotal.bind(this);
    }

    getTotal =() => {
        const { odd } = this.props;
        const { odds } = odd;
        const pre = odds.filter(item => item.hasOwnProperty('0'))
        const mid = odds.filter(item => item.hasOwnProperty('15'))
        const ht = odds.filter(item => item.hasOwnProperty('30'));
    
        return {
            kickoff: pre.length > 0 ? pre[0]['0'].bookieTotal: 0,
            midhalf: mid.length > 0 ? mid[0]['15'].bookieTotal: 0,
            ht: ht.length > 0 ? ht[0]['30'].bookieTotal: 0
        }
    }

    calcProb = () => {
       let data =  this.getTotal();
       findSimilar(data).then(data => console.log(data));
    }
    render(){
        const { odd } = this.props;
        return(
            <div style={inplayWrapperStyles}>
                    <div>{odd.id}</div>
                    <div>
                        <button onClick={()=> this.calcProb()} className="btn btn-large btn-block btn-success">button</button>
                    </div>             
            </div>
        )
    }
}

export default InplayItem;