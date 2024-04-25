import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, searchForWorkspaceRoot  } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		fs: {
		  allow: [
			// search up for workspace root
			searchForWorkspaceRoot(process.cwd()),
			// your custom rules
			'D:/2e_master/Tweede_semester/Data_Visualization/Project/static',
		  ],
		},
	  },
});
