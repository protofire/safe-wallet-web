import EthHashInfo from '@/components/common/EthHashInfo'
import { safeCreationPendingStatuses } from '@/features/counterfactual/hooks/usePendingSafeStatuses'
import { SafeCreationEvent, safeCreationSubscribe } from '@/features/counterfactual/services/safeCreationEvents'
import { useCurrentChain } from '@/hooks/useChains'
import { useEffect, useState } from 'react'
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import type { ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'
import NetworkLogosList from '../multichain/components/NetworkLogosList'
import useAllAddressBooks from '@/hooks/useAllAddressBooks'

const CounterfactualSuccessScreen = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [safeAddress, setSafeAddress] = useState<string>()
  const [networks, setNetworks] = useState<ChainInfo[]>([])
  const chain = useCurrentChain()
  const addressBooks = useAllAddressBooks()
  const safeName = safeAddress && chain ? addressBooks?.[chain.chainId]?.[safeAddress] : ''
  const isCFCreation = !!networks.length
  const isMultiChain = networks.length > 1
  const chainName = isMultiChain ? '' : isCFCreation ? networks[0].chainName : chain?.chainName

  useEffect(() => {
    const unsubFns = Object.entries(safeCreationPendingStatuses).map(([event]) =>
      safeCreationSubscribe(event as SafeCreationEvent, async (detail) => {
        if (event === SafeCreationEvent.INDEXED) {
          setSafeAddress(detail.safeAddress)
          setOpen(true)
        }
        if (event === SafeCreationEvent.AWAITING_EXECUTION) {
          if ('networks' in detail) setNetworks(detail.networks)
          setSafeAddress(detail.safeAddress)
          setOpen(true)
        }
      }),
    )

    return () => {
      unsubFns.forEach((unsub) => unsub())
    }
  }, [])

  return (
    <Dialog open={open}>
      <DialogContent
        sx={{
          py: 10,
          px: 6,
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Box
          sx={{
            backgroundColor: ({ palette }) => palette.success.background,
            padding: 3,
            borderRadius: '50%',
            display: 'inline-flex',
          }}
        >
          <CheckRoundedIcon sx={{ width: 50, height: 50 }} color="success" />
        </Box>

        <Box textAlign="center">
          <Typography variant="h3" fontWeight="bold" mb={1}>
            {isCFCreation ? 'Your account is almost set!' : 'Your account is all set!'}
          </Typography>
          <Typography variant="body2">
            {isCFCreation
              ? `Activate the account ${isMultiChain ? 'per network' : ''} to unlock all features of your smart wallet.`
              : 'Start your journey to the smart account security now.'}
          </Typography>
          <Typography variant="body2">
            {isCFCreation && isMultiChain
              ? `You can use the address below to receive funds on the selected ${
                  isMultiChain ? 'networks' : 'network'
                }.`
              : `Use your address to receive funds ${chainName ? `on ${chainName}` : ''}`}
          </Typography>
        </Box>

        {safeAddress && (
          <Box p={2} bgcolor="background.main" borderRadius={1} fontSize={14}>
            <NetworkLogosList networks={networks} />
            <Typography variant="h5" mt={2}>
              {safeName}
            </Typography>
            <EthHashInfo
              address={safeAddress}
              showCopyButton
              shortAddress={false}
              showAvatar={false}
              showName={false}
              showPrefix={false}
            />
          </Box>
        )}

        <Button variant="contained" onClick={() => setOpen(false)} data-testid="cf-creation-lets-go-btn">
          Let&apos;s go
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default CounterfactualSuccessScreen
