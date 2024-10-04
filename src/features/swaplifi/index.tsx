import type { WidgetConfig } from '@lifi/widget';
import { LiFiWidget, useWidgetEvents, WidgetEvent } from '@lifi/widget';
import css from './styles.module.css';
import { Box, Typography, CircularProgress } from '@mui/material';
import SafeAppsSDK from '@safe-global/safe-apps-sdk';
import { useEffect, useMemo, useState } from 'react';
import { createConfig, WagmiProvider, http } from 'wagmi';
import { arbitrum, optimism, base, bsc, linea } from 'wagmi/chains';
import { safe as SafeConnector } from '@wagmi/connectors';

const SwapWidget = () => {
	const [sdk, setSdk] = useState<SafeAppsSDK | null>(null);
	const [safeInfo, setSafeInfo] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const widgetEvents = useWidgetEvents();

	useEffect(() => {
		const initSDK = async () => {
			try {
				console.log('Initializing SafeAppsSDK...');
				const safeSDK = new SafeAppsSDK();
				setSdk(safeSDK);
				console.log('SafeAppsSDK initialized');

				console.log('Fetching Safe info...');
				const infoPromise = safeSDK.safe.getInfo();
				
				// Add a timeout to the getInfo call
				const timeoutPromise = new Promise((_, reject) => 
					setTimeout(() => reject(new Error('getInfo timed out')), 10000)
				);

				const info = await Promise.race([infoPromise, timeoutPromise]);
				console.log('Safe info fetched:', info);
				setSafeInfo(info);
			} catch (err) {
				console.error('Error initializing SDK or fetching Safe info:', err);
				setError(`Failed to initialize Safe: ${err instanceof Error ? err.message : 'Unknown error'}`);
			} finally {
				setIsLoading(false);
			}
		};
		initSDK();
	}, []);

	const config = useMemo(() => {
		if (!safeInfo) return null;
		console.log('Creating Wagmi config...');

		return createConfig({
			chains: [arbitrum, optimism, base, bsc, linea],
			connectors: [
				SafeConnector({
					allowedDomains: [/.*/],
					debug: true,
				}),
			],
			transports: {
				[arbitrum.id]: http(),
				[optimism.id]: http(),
				[base.id]: http(),
				[bsc.id]: http(),
				[linea.id]: http(),
			},
		});
	}, [safeInfo]);

	const widgetConfig: WidgetConfig = {
		integrator: "safe",
		variant: "wide",
		subvariant: "split",
		appearance: "auto",
		theme: {
			palette: {
				primary: { main: "#5C67FF" },
				secondary: { main: "#F5B5FF" }
			},
			typography: { fontFamily: "Inter, sans-serif" },
			shape: {
				borderRadius: 16,
				borderRadiusSecondary: 16,
			},
		},
		chains: {
			allow: [arbitrum.id, optimism.id, base.id, bsc.id, linea.id],
		},
	};

	useEffect(() => {
		if (!sdk) return;

		const onRouteExecutionStarted = (route: any) => {
			console.log('Route execution started:', route);
		};

		const onRouteExecutionUpdated = (update: any) => {
			console.log('Route execution update:', update);
		};

		const onRouteExecutionCompleted = (route: any) => {
			console.log('Route execution completed:', route);
		};

		const onRouteExecutionFailed = (update: any) => {
			console.error('Route execution failed:', update);
		};

		const onTxSubmit = (data: any) => {
			console.log('Transaction submitted:', data);
			const { txRequest } = data;
			sdk.txs.send({
				txs: [{
					to: txRequest.to,
					value: txRequest.value,
					data: txRequest.data,
				}],
			}).then(console.log).catch(console.error);
		};

		widgetEvents.on(WidgetEvent.RouteExecutionStarted, onRouteExecutionStarted);
		widgetEvents.on(WidgetEvent.RouteExecutionUpdated, onRouteExecutionUpdated);
		widgetEvents.on(WidgetEvent.RouteExecutionCompleted, onRouteExecutionCompleted);
		widgetEvents.on(WidgetEvent.RouteExecutionFailed, onRouteExecutionFailed);
		widgetEvents.on(WidgetEvent.RouteExecutionStarted, onTxSubmit);

		return () => {
			widgetEvents.all.clear();
		};
	}, [sdk, widgetEvents]);

	if (error) {
		return (
			<Box>
				<Typography color="error">{error}</Typography>
				<Typography>Debug info:</Typography>
				<pre>{JSON.stringify({ sdk: !!sdk, safeInfo }, null, 2)}</pre>
			</Box>
		);
	}

	if (isLoading) {
		return (
			<Box display="flex" alignItems="center" justifyContent="center" height="100vh">
				<CircularProgress />
				<Typography ml={2}>Initializing Safe... This may take a while.</Typography>
			</Box>
		);
	}

	if (!config || !safeInfo) {
		return (
			<Box>
				<Typography>Failed to load Safe information. Please ensure you're using this app within a Safe environment.</Typography>
				<Typography>Debug info:</Typography>
				<pre>{JSON.stringify({ config, safeInfo }, null, 2)}</pre>
			</Box>
		);
	}

	console.log('Rendering LiFiWidget...');

	return (
		<Box className={css.swapWidget} id="swapWidget">
			<WagmiProvider config={config}>
				<LiFiWidget config={widgetConfig} integrator="protofire"/>
			</WagmiProvider>
		</Box>
	);
}

export default SwapWidget;