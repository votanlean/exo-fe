import deployTEXO from './deployTEXO';
import deployTEXOOrchestrator from './deployOrchestrator';
import deploySeedingPools from './deploySeedingPools';
import deployLpPools from './deployLpPools';
import deployFAANG from './deployFAANG';
import deployFAANGOrchestrator from './deployFAANGOrchestrator';
import deployFAANGPools from './deployFAANGPools';

async function deployAll() {
  try {
    const texoAddress = await deployTEXO();
    console.log('Contract tEXO deployed to', texoAddress);

    const tEXOOrchestratorAddress = await deployTEXOOrchestrator(texoAddress);
    console.log('Orchestrator contract deployed to', tEXOOrchestratorAddress);

    await deploySeedingPools(tEXOOrchestratorAddress);
    await deployLpPools(tEXOOrchestratorAddress);

    const faangAddress = await deployFAANG();
    console.log('Contract FAANG deployed to', faangAddress);

    const faangOrchestratorAddress = await deployFAANGOrchestrator(
      faangAddress,
    );
    console.log(
      'Contract FAANG Orchestrator deployed to',
      faangOrchestratorAddress,
    );

    await deployFAANGPools(faangOrchestratorAddress, faangAddress);
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

deployAll();
