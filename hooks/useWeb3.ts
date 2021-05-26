import {useWeb3React} from "@web3-react/core";
import Web3 from "web3";
import {useEffect, useRef, useState} from "react";
import {getWeb3NoAccount} from "../utils/web3";

export function useWeb3() {
    const { library } = useWeb3React()
    const refEth = useRef(library)
    const [web3, setweb3] = useState(library ? new Web3(library) : getWeb3NoAccount())

    useEffect(() => {
        if (library !== refEth.current) {
            setweb3(library ? new Web3(library) : getWeb3NoAccount())
            refEth.current = library
        }
    }, [library])

    return web3
}
