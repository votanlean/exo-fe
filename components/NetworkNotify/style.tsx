import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
    return {
        notify: {
            padding: 0,
            margin: 0,
            width: '100%',
            height: '46px !important' ,
            backgroundColor: '#c13d54',
            boxSizing: 'border-box',
            color: '#fff',
            textAlign: 'center',
            fontSize: '20px',
            alignItems: 'center',
        },
        
        
        p: {
            lineHeight: '46px',
            display: 'inline'

        },
        button: {
            backgroundColor: '#fff',
            marginLeft: '10px',
            '&:hover': {
                backgroundColor: '#000',
                color: '#fff',
            },
        }
        
    }
});

export {useStyles};