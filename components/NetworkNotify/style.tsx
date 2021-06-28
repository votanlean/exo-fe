import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
    return {
        notify: {
            padding: 0,
            margin: 0,
            width: '100%',
            height: '52px !important' ,
            backgroundColor: '#c13d54',
            boxSizing: 'border-box',
            color: '#fff',
            textAlign: 'center',
            fontSize: '20px',
            alignItems: 'center',
        },
        link: {
            color: '#fff',
            lineHeight: '46px',
            textDecoration: 'underline',
            margin: '0px 10px'
        },
        
        p: {
            // lineHeight: '44px',
            display: 'inline'

        },
        button: {
            backgroundColor: '#fff',
            marginLeft: '10px'
        }
        
    }
});

export {useStyles};