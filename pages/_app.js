
import "../public/theme.css";
import "../public/output.css";
import "../public/css/ideas.css";
import "../public/css/daos.css";
import { ThemeProvider } from 'next-themes'
import { SnackbarProvider } from "notistack";
import { UtilsProvider } from "../contexts/UtilsContext";

function MyApp({ Component, pageProps }) {
	return (
		<SnackbarProvider anchorOrigin={{ vertical: "top", horizontal: "right" }} maxSnack={5} autoHideDuration={3000} >
			<UtilsProvider>
				<ThemeProvider defaultTheme={"dark"} enableColorScheme={false} attribute="class" enableSystem={false}>
					<Component {...pageProps} />
				</ThemeProvider>
			</UtilsProvider>
		</SnackbarProvider>
	);
}

export default MyApp;
