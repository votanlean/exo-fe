import Head from 'next/head'
import { makeStyles } from '@material-ui/core/styles'
import {
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  CardHeader,
  IconButton,
  Avatar,
} from '@material-ui/core'
import { Tune, History, ExpandMore } from '@material-ui/icons'

const useStyles = makeStyles({
  root: {
    borderRadius: 20,
    maxWidth: 436,
    width: '100%',
    margin: '0 auto',
  },
  header: {
    borderBottom: '1px solid rgb(233 234 235)',
  },
  box: {
    padding: 16,
    borderRadius: 12,
  },
  iconDown: {
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    backgroundColor: 'rgb(239, 244, 245)',
    borderRadius: 16,
    padding: 0,
    minWidth: 32,
  },
  iconAva: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
})

function Pool() {
  const classes = useStyles()

  return (
    <>
      <Head>
        <title>Exchange</title>
      </Head>

      <div className="container pool-container">
        <div className="exchange-grid">
          <Card className={classes.root}>
            <CardHeader
              className={classes.header}
              title="Exchange"
              subheader="Trade tokens in an instant"
              action={
                <Box display="flex" alignItems="center">
                  <IconButton>
                    <Tune color="primary" />
                  </IconButton>
                  <IconButton>
                    <History color="primary" />
                  </IconButton>
                </Box>
              }
            />
            <CardContent>
              <Box display="grid" gridAutoRows="auto" gridRowGap={20}>
                <Box className={classes.box} bgcolor="#B8DDFF">
                  <Typography variant="subtitle2">From</Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    marginTop={1.5}
                  >
                    <Typography variant="body1">0.0</Typography>
                    <Button>
                      <Avatar
                        className={classes.iconAva}
                        src="/static/images/pool/USDT.png"
                      />
                      <Typography variant="subtitle2">USDT</Typography>
                      <ExpandMore color="primary" />
                    </Button>
                  </Box>
                </Box>

                <Box>
                  <Button className={classes.iconDown}>
                    <svg
                      viewBox="0 0 24 24"
                      color="#007EF3"
                      width="24px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M11 5V16.17L6.11997 11.29C5.72997 10.9 5.08997 10.9 4.69997 11.29C4.30997 11.68 4.30997 12.31 4.69997 12.7L11.29 19.29C11.68 19.68 12.31 19.68 12.7 19.29L19.29 12.7C19.68 12.31 19.68 11.68 19.29 11.29C18.9 10.9 18.27 10.9 17.88 11.29L13 16.17V5C13 4.45 12.55 4 12 4C11.45 4 11 4.45 11 5Z"></path>
                    </svg>
                  </Button>
                </Box>

                <Box className={classes.box} bgcolor="#B8DDFF">
                  <Typography variant="subtitle2">To</Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    marginTop={1.5}
                  >
                    <Typography variant="body1">0.0</Typography>
                    <Button>
                      <Avatar
                        className={classes.iconAva}
                        src="/static/images/pool/USDT.png"
                      />
                      <Typography variant="subtitle2">USDT</Typography>
                      <ExpandMore color="primary" />
                    </Button>
                  </Box>
                </Box>
                <Box>
                  <button className="button btn-secondary">
                    <span>Unlock Wallet</span>
                  </button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Pool
