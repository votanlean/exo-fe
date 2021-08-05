import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
    return {
        notify: {
            position: 'fixed',
            top: 0,
            zIndex: 10,
            padding: 0,
            margin: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: '#c13d54',
            boxSizing: 'border-box',
            color: '#fff',
            textAlign: 'center',
            fontSize: '20px',
            alignItems: 'center',
            marginTop: '62px',
            [theme.breakpoints.down('sm')]: {
				flexDirection: 'column',
                paddingBottom: '12px',
                paddingTop: '4px'
			}
        },
        
        
        p: {
            lineHeight: '46px',
            display: 'inline',
            [theme.breakpoints.down('sm')]: {
                lineHeight: '32px'
            }
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