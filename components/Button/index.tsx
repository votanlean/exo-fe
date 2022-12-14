import { withStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { purple } from '@material-ui/core/colors';

const CustomButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText(purple[500]),
    textTransform: 'none',
    backgroundColor: '#007ef3',
    boxShadow: 'rgb(14 14 44 / 40%) 0px -1px 0px 0px inset',
    fontSize: '16px',
    fontWeight: 600,
    height: '48px',
    borderRadius: '16px',
    paddingLeft: '20px',
    paddingRight: '20px',
    '&:hover': {
      backgroundColor: '#0058aa',
    },
  },
  disabled: {
    color: 'white !important',
    opacity: 0.5,
    cursor: 'not-allowed !important',
  },
}))(Button);

export default CustomButton;
